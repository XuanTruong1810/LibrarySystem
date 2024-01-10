using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/[controller]/[action]")]
public class CartController : ControllerBase
{
    private readonly DBContextUser context;

    static List<Cart> ListCard = new List<Cart>();
    public CartController(DBContextUser context)
    {
        this.context = context;

    }

    [HttpGet]
    public ActionResult GetCart()
    {
        List<Cart>? cartItem = HttpContext.Session.Get<List<Cart>>("Cart");
        if (cartItem == null)
        {
            cartItem = new List<Cart>();
        }
        return Ok(cartItem);
    }
    [HttpPost]
    public ActionResult AddCart([FromBody] CartModel model)
    {
        var item = ListCard.FirstOrDefault(product => product.Id_Product == model.Id_Product);
        if (item == null)
        {
            try
            {
                var product = context.Product.Where(product => product.ID_Product == model.Id_Product).FirstOrDefault();
                if (product == null)
                {
                    return Ok();
                }
                ListCard.Add(new Cart
                {
                    Id_Product = product.ID_Product,
                    NameProduct = product.Name_Product,
                    Image = product.Image,
                    Quality = model.Quality,
                });
            }
            catch (Exception)
            {
                Console.WriteLine("Lỗi rồi");

            }
        }
        else
        {
            item.Quality += model.Quality;
        }
        HttpContext.Session.Set("Cart", ListCard);
        return Ok("Insert Product Success");
    }
    [HttpDelete]
    public ActionResult DeleteCart([FromBody] int[] productIds)
    {
        if (productIds == null || productIds.Length == 0)
        {
            return BadRequest("No product IDs provided");
        }

        foreach (int id in productIds)
        {
            var item = ListCard.FirstOrDefault(product => product.Id_Product == id);
            if (item != null)
            {
                ListCard.Remove(item);
            }
        }

        HttpContext.Session.Set("Cart", ListCard);
        return Ok("Remove products success");
    }
    [HttpPut]
    public ActionResult UpdateCart([FromQuery] int id, [FromQuery] int Quality)
    {
        var item = ListCard.FirstOrDefault(product => product.Id_Product == id);
        if (item == null)
        {
            return NotFound();
        }
        else
        {
            item.Quality = Quality;
            HttpContext.Session.Set("Cart", ListCard);
            return Ok("Update product success");
        }
    }

}