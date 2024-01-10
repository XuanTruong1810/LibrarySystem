using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
[ApiController]
[Route("/api/[controller]/[action]")]
public class ProductController : ControllerBase
{
    public readonly DBContextUser context;
    public ProductController(DBContextUser context)
    {
        this.context = context;
    }
    [HttpGet]
    public ActionResult GetBrand()
    {
        var ListBrand = context.Brand.ToList();
        return Ok(ListBrand);
    }
    [HttpGet]
    public ActionResult GetAuthor()
    {
        var ListAuthor = context.Author.ToList();
        return Ok(ListAuthor);
    }
    [HttpGet]
    public ActionResult GetPublisher()
    {
        var ListPublishingCompany = context.PublishingCompany.ToList();
        return Ok(ListPublishingCompany);
    }
    [HttpGet]
    public ActionResult GetProductByIDBrand([FromQuery] int id)
    {
        var Products = context.Product.Where(p => p.ID_Brand == id && p.Is_delete == false && p.Count_Product > 0);
        return Ok(Products);
    }
    [HttpGet]
    public ActionResult SearchProduct([FromQuery] string KeySearch)
    {
        if (string.IsNullOrEmpty(KeySearch))
        {
            return Ok(context.Product.ToList());
        }
        else
        {
            var Products = context.Product.Where(p => p.Name_Product.Contains(KeySearch) && p.Is_delete == false && p.Count_Product > 0).ToList();
            return Ok(Products);

        }

    }
    [HttpGet]
    public ActionResult GetProductPage(int pageNumber, int pageSize)
    {
        int startIndex = (pageNumber - 1) * pageSize;
        var Products = context.Product.Where(p => p.Is_delete == false && p.Count_Product > 0).Skip(startIndex).Take(pageSize).ToList();
        var CountProduct = context.Product.ToList().Count();
        var result = new
        {
            Products,
            TotalProductCount = CountProduct
        };
        return Ok(result);
    }
    [HttpGet]

    public ActionResult GetProductByID(int id)
    {
        if (!ModelState.IsValid)
        {
            return NotFound("Model không hợp lệ");
        }
        else
        {
            var product = context.Product.Where(p => p.ID_Product == id && p.Is_delete == false)
                .Select(p => new
                {
                    p.ID_Product,
                    p.Name_Product,
                    p.Count_Product,
                    p.PublicationDate,
                    p.Image,
                    p.Description,
                    p.Brand.ID_Brand,
                    p.Author.Name_Author,
                    p.Author.ID_Author,
                    p.PublishingCompany.ID_PublishingCompany,
                    p.PublishingCompany.Name_PublishingCompany,
                }).FirstOrDefault();

            return Ok(product);
        }
    }
}