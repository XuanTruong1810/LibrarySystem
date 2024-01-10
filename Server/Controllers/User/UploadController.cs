using System.Drawing;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/[controller]/[action]")]
public class UploadController : ControllerBase
{
    public readonly IWebHostEnvironment webHostEnvironment;
    public readonly UserManager<ApplicationUser> userManager;

    public UploadController(IWebHostEnvironment webHostEnvironment, UserManager<ApplicationUser> userManager)
    {
        this.webHostEnvironment = webHostEnvironment;
        this.userManager = userManager;
    }
    [HttpPost]
    [Authorize]
    public async Task<ActionResult> UploadImage(IFormFile file)
    {

        var Email = User.FindFirstValue(ClaimTypes.Email);
        if (Email != null)
        {
            var user = await userManager.FindByEmailAsync(Email);
            if (user != null)
            {
                if (file != null)
                {
                    string fileName = Path.GetFileNameWithoutExtension(Path.GetRandomFileName());
                    string extension = Path.GetExtension(file.FileName);
                    fileName += extension;
                    var fileSave = Path.Combine("wwwroot", "Users", "Image", fileName);
                    using (var FileStream = new FileStream(fileSave, FileMode.Create))
                    {
                        await file.CopyToAsync(FileStream);
                        user.Image = fileName;
                        await userManager.UpdateAsync(user);
                        return Ok(user);
                    }
                }
                else
                {
                    return NotFound("Upload k thành công");
                }
            }
            else
            {
                return NotFound("Không tìm thấy người dùng");
            }
        }
        else
        {
            return BadRequest("Lỗi ở đây nhen");
        }

    }
    [HttpPost]
    [Authorize]
    public async Task<ActionResult> UploadFile([FromBody] AccountUser accountUser)
    {
        var Email = User.FindFirstValue(ClaimTypes.Email);
        if (Email != null)
        {
            var user = await userManager.FindByEmailAsync(Email);
            if (user != null)
            {
                user.PhoneNumber = accountUser.Telephone;
                user.UserName = accountUser.UserName;
                user.Birthday = accountUser.Birthday;
                user.Gender = accountUser.Gender;
                await userManager.UpdateAsync(user);
                return Ok(user);

            }
            else
            {
                return NotFound("Update Profile not success");
            }
        }
        else
        {
            return NotFound("Không tìm thấy người dùng");
        }

    }

    [HttpPost]

    public async Task<ActionResult> UploadImageProduct(IFormFile file)
    {
        if (file != null)
        {
            string fileName = Path.GetFileNameWithoutExtension(Path.GetRandomFileName());
            string extension = Path.GetExtension(file.FileName);
            fileName += extension;
            var fileSave = Path.Combine("wwwroot", "Products", "Image", fileName);
            using (var FileStream = new FileStream(fileSave, FileMode.Create))
            {
                await file.CopyToAsync(FileStream);
                return Ok(fileName);
            }
        }
        else
        {
            return NotFound("Upload k thành công");
        }
    }
}