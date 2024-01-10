using System.IdentityModel.Tokens.Jwt;
// using MimeKit;
// using MailKit;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks.Dataflow;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
// using MailKit.Net.Smtp;
[ApiController]
[Route("/api/[controller]/[action]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> userManager;
    private readonly DBContextUser context;
    private readonly SignInManager<ApplicationUser> signInManager;
    private readonly RoleManager<IdentityRole> roleManager;
    // private readonly IConfiguration configuration;
    // private readonly IMailService mailService;

    public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
         IConfiguration configuration, RoleManager<IdentityRole> roleManager, DBContextUser context)
    {
        this.userManager = userManager;
        this.signInManager = signInManager;

        this.roleManager = roleManager;
        this.context = context;

    }
    [HttpPost]
    public async Task<ActionResult> Register(AccountRegister register)
    {
        if (ModelState.IsValid)
        {
            var check = await userManager.FindByEmailAsync(register.Email);

            if (check != null)
            {
                return Unauthorized("Tài khoản đã được đăng ký");
            }
            var newUser = new ApplicationUser
            {
                Email = register.Email,
                UserName = register.UserName,
            };

            var result = await userManager.CreateAsync(newUser, register.Password);

            if (result.Succeeded)
            {
                if (!await roleManager.RoleExistsAsync("User"))
                {
                    var role = new IdentityRole
                    {
                        Name = "User"
                    };
                    await roleManager.CreateAsync(role);

                }

                await userManager.AddToRoleAsync(newUser, "User");
                LibraryCard newLibraryCard = new()
                {
                    Id = newUser.Id,
                    Status = 0,
                };
                await context.LibraryCard.AddAsync(newLibraryCard);
                await context.SaveChangesAsync();
                return Ok(result.Succeeded);
            }
            else
            {
                return Unauthorized(result.Errors);
            }
        }
        else
        {
            return NotFound();
        }
    }
    [HttpPost]
    public async Task<ActionResult> CreateAdmin(AccountRegister register)
    {
        if (ModelState.IsValid)
        {
            var check = await userManager.FindByEmailAsync(register.Email);

            if (check != null)
            {
                return Unauthorized("Tài khoản đã được đăng ký");
            }
            var newUser = new ApplicationUser
            {
                Email = register.Email,
                UserName = register.UserName,
            };

            var result = await userManager.CreateAsync(newUser, register.Password);

            if (result.Succeeded)
            {
                if (!await roleManager.RoleExistsAsync("Admin"))
                {
                    var role = new IdentityRole
                    {
                        Name = "Admin"
                    };
                    await roleManager.CreateAsync(role);

                }

                await userManager.AddToRoleAsync(newUser, "Admin");
                LibraryCard newLibraryCard = new()
                {
                    Id = newUser.Id,
                    Status = 0,
                };
                await context.LibraryCard.AddAsync(newLibraryCard);
                await context.SaveChangesAsync();
                return Ok(result.Succeeded);
            }
            else
            {
                return Unauthorized(result.Errors);
            }
        }
        else
        {
            return NotFound();
        }
    }
    [HttpPost]
    public async Task<ActionResult> Login(AccountLogin accountLogin)
    {
        if (ModelState.IsValid)
        {
            var user = await userManager.FindByEmailAsync(accountLogin.Email);
            if (user != null)
            {

                if (user.UserName != null)
                {
                    if (await userManager.IsLockedOutAsync(user))
                    {
                        return Unauthorized("Tài khoản đã bị khóa");
                    }
                    var checkLogin = await signInManager.PasswordSignInAsync
                                                   (user.UserName, accountLogin.Password, false, false);
                    if (!checkLogin.Succeeded)
                        return Unauthorized("Tài khoản hoặc mật khẩu không chính xác");
                    else
                    {
                        var roles = await userManager.GetRolesAsync(user);
                        return Ok(new { roles });
                    }
                }
                else
                {
                    return Unauthorized("Không tìm thấy UserName");
                }

            }
            else
            {
                return Unauthorized("Tài khoản không tồn tại");
            }

        }
        else
        {
            return NotFound("Thông tin nhập vào không chính xác");
        }
    }
    [HttpPost]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        var Email = User.FindFirstValue(ClaimTypes.Email);
        if (Email != null)
        {
            await signInManager.SignOutAsync();
            return Ok("Đã logout thành công");
        }
        else
        {
            return Unauthorized();
        }
    }

    [HttpPost]
    public async Task<IActionResult> GoogleLogin([FromQuery] string token)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var validateToken = handler.ReadToken(token) as JwtSecurityToken;
            var Email = validateToken.Claims.FirstOrDefault(claim => claim.Type == "email")?.Value;
            var UserName = validateToken.Claims.FirstOrDefault(claim => claim.Type == "family_name")?.Value;
            var Image = validateToken.Claims.FirstOrDefault(claim => claim.Type == "picture")?.Value;

            var user = await userManager.FindByEmailAsync(Email);

            if (user == null)
            {
                var newUser = new ApplicationUser
                {
                    UserName = UserName,
                    Email = Email,
                    Image = Image
                };

                var result = await userManager.CreateAsync(newUser);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newUser, "User");

                    var loginProvider = "Google";
                    var providerKey = validateToken.Claims.FirstOrDefault(claim => claim.Type == "sub")?.Value;
                    var existingLogin = await userManager.FindByLoginAsync(loginProvider, providerKey);

                    if (existingLogin == null)
                    {
                        var addLoginResult = await userManager.AddLoginAsync(newUser, new UserLoginInfo(loginProvider, providerKey, loginProvider));
                        if (!addLoginResult.Succeeded)
                        {
                            return BadRequest("Không thể đăng nhập");
                        }
                    }
                    await signInManager.SignInAsync(newUser, isPersistent: false);

                    var roles = await userManager.GetRolesAsync(newUser);
                    LibraryCard newLibraryCard = new()
                    {
                        Id = newUser.Id,
                        Status = 0,
                    };
                    await context.LibraryCard.AddAsync(newLibraryCard);
                    await context.SaveChangesAsync();
                    return Ok(new { roles });
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            else
            {
                await signInManager.SignInAsync(user, isPersistent: false);

                var roles = await userManager.GetRolesAsync(user);

                return Ok(new { roles });
            }
        }
        catch (Exception)
        {
            return StatusCode(500, "Lỗi hệ thống");
        }
    }

    [HttpPost]
    public async Task<ActionResult> ForgotPassword([FromQuery] string Email)
    {
        var user = await userManager.FindByEmailAsync(Email);
        if (user == null)
        {
            return BadRequest("Không tìm thấy người dùng");
        }
        else
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            Url.Action("ResetPassword", "Account", new { token, email = user.Email }, Request.Scheme);
            string Subject = "Reset Password";
            string emailBody = "<html><body><h3>Click me to reset password</h3>";
            emailBody += $"<p>Please click the button below to reset your password:</p>";
            emailBody += $"<a href='http://localhost:3000/ResetPassword?token={WebUtility.UrlEncode(token)}&email={WebUtility.UrlEncode(Email)}'>";
            emailBody += $"<button style='padding: 10px 20px; background-color: #008CBA; color: white; border: none; border-radius: 5px;'>Reset Password</button></a>";
            emailBody += "</body></html>";
            SendEmail sendEmail = new SendEmail(Email, emailBody, Subject);
            sendEmail.Send();
            return Ok("true");
        }
    }
    [HttpPost]
    public async Task<ActionResult> Resetpassword([FromQuery] string Password, string email, string token)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return BadRequest("Không tìm thấy người dùng");
        }

        var resetPassResult = await userManager.ResetPasswordAsync(user, token, Password);
        if (resetPassResult.Succeeded)
        {

            return Ok("Cập nhật mật khẩu thành công");
        }
        else
        {
            return BadRequest("Cập nhật mật khẩu thất bảo");
        }
    }
}

