using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("/api/[controller]/[action]")]
public class InfoUser : ControllerBase
{
    public readonly UserManager<ApplicationUser> userManager;
    public readonly DBContextUser context;
    public InfoUser(UserManager<ApplicationUser> userManager, DBContextUser context)
    {
        this.userManager = userManager;
        this.context = context;
    }
    [Authorize]
    [HttpGet]
    public async Task<ActionResult> Get()
    {
        var Email = User.FindFirstValue(ClaimTypes.Email);
        if (Email != null)
        {
            var user = await userManager.FindByEmailAsync(Email);

            if (user != null)
            {
                var data = await context.LibraryCard.Where(p => p.Id == user.Id)
                    .Include(p => p.ApplicationUser)
                    .Select(p => new
                    {
                        p.ApplicationUser.UserName,
                        p.ApplicationUser.Image,
                        p.ApplicationUser.Gender,
                        p.ApplicationUser.Email,
                        p.ApplicationUser.Birthday,
                        p.ID_LibraryCard,
                        p.ApplicationUser.PhoneNumber,

                    }).FirstOrDefaultAsync();

                return Ok(data);
            }
            else
            {
                return NotFound("Không tìm thấy người dùng");
            }
        }
        else
        {
            return BadRequest("Lỗi");
        }
    }
}