using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]/[action]")]
public class ReqCart : ControllerBase
{
    private readonly DBContextUser context;
    private readonly UserManager<ApplicationUser> userManager;
    public ReqCart(DBContextUser context, UserManager<ApplicationUser> userManager)
    {
        this.context = context;
        this.userManager = userManager;

    }
    [HttpGet]
    public async Task<ActionResult> GetCart()
    {

        var data = context.Users.Select(p => new
        {
            p.Id,
            p.UserName,
        });
        return data != null ? Ok(data) : NotFound("Không tìm thấy");
    }
    [Authorize]
    [HttpPost]
    public async Task<ActionResult> RequestCart()
    {

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        else
        {
            LibraryCard libraryCard = new LibraryCard()
            {
                Id = userId,
            };
            var CartLibrary = await context.LibraryCard.Where(p => p.Id == userId).FirstOrDefaultAsync();
            if (CartLibrary != null)
            {
                CartLibrary.Status = 1;
                context.SaveChanges();
                return Ok("Thành công");
            }
            else
            {
                return Unauthorized();
            }

        }
    }
    [HttpPut]
    public async Task<ActionResult> AcceptCart([FromQuery] int id)
    {
        var userId = await context.LibraryCard.FirstOrDefaultAsync(p => p.ID_LibraryCard == id);
        if (userId == null)
        {
            return NotFound();
        }
        else
        {
            userId.Status = 2;
            context.SaveChanges();
            return Ok("Thành công");
        }
    }
    [HttpPut]
    public async Task<ActionResult> AcceptGetCart([FromQuery] int id)
    {
        var userId = await context.LibraryCard.FirstOrDefaultAsync(p => p.ID_LibraryCard == id);
        if (userId == null)
        {
            return NotFound();
        }
        else
        {
            userId.Status = 3;
            context.SaveChanges();
            return Ok("thành công");
        }
    }
    [Authorize]
    [HttpGet]
    public async Task<ActionResult> CheckCart()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId != null)
        {
            var cart = await context.LibraryCard.Where(p => p.Id == userId).FirstOrDefaultAsync();
            if (cart != null)
            {
                return Ok(cart.Status);
            }
            return NotFound("Chưa đăng nhập!");
        }
        return NotFound();
    }
}