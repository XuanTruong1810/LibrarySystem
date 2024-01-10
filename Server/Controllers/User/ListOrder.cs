
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/[controller]")]
public class ListOrder : ControllerBase
{

    public readonly DBContextUser context;

    public ListOrder(DBContextUser context)
    {
        this.context = context;
    }
    [HttpGet]
    public ActionResult Get()
    {
        var Orders = context.Loans.Where(order => order.Id == "1"); // fake id người dùng
        return Ok(Orders);
    }
}