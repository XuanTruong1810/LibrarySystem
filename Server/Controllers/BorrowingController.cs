using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("/api/[controller]/[action]")]
public class BorrowingController : ControllerBase
{
    public readonly DBContextUser context;
    public BorrowingController(DBContextUser context)
    {
        this.context = context;
    }
    [HttpGet]
    public ActionResult GetAllOrder()
    {
        var Loans = context.Loans
            .Include(p => p.ApplicationUser)
            .Select(p => new
            {
                UserName = p.ApplicationUser.UserName,
                BorrowingDay = p.BorrowingDay,
                Status = p.Status,
                ID_Loans = p.ID_Loans,
            });
        return Ok(Loans);
    }

    [HttpGet]
    public ActionResult AcceptOrder([FromQuery] int id)
    {
        var Orders = context.Loans.FirstOrDefault(o => o.ID_Loans == id);
        if (Orders == null)
        {
            return NotFound("Order not null");
        }
        else
        {
            Orders.Status = 1;
            context.SaveChanges();
            return Ok();
        }
    }
    [HttpGet]
    [Authorize]
    public async Task<ActionResult> History()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId != null)
        {
            var ordersByDay = await context.Loans
                .Where(o => o.Id == userId)
                .Include(o => o.BorrowingDetails)
                .GroupBy(o => o.BorrowingDay.Date)
                .Select(group => new
                {
                    BorrowingDay = group.Key,
                    Loans = group.Select(o => new
                    {
                        OrderId = o.ID_Loans,
                        OrderDate = o.BorrowingDay,
                        Status = o.Status,
                        BorrowingDetails = o.BorrowingDetails.Select(od => new
                        {
                            ID_orderDetail = od.ID_BorrowingDetails,
                            ProductName = od.Product.Name_Product,
                            ImageUrl = od.Product.Image,
                            countOrder = od.Count,
                        })
                    })
                })
                .ToListAsync();

            JsonSerializerOptions options = new()
            {
                ReferenceHandler = ReferenceHandler.IgnoreCycles,
                WriteIndented = true
            };
            var ordersForDays = ordersByDay.Select(day => new
            {
                OrderDate = day.BorrowingDay,
                Orders = day.Loans.ToList()
            }).ToList();

            return ordersForDays.Any()
                ? Ok(JsonSerializer.Serialize(ordersForDays, options))
                : BadRequest("No orders found");
        }
        else
        {
            return Unauthorized();
        }
    }
}