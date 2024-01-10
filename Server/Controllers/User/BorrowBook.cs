
using System.Security.Claims;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using MimeKit;
[ApiController]
[Route("/api/[controller]")]
public class BorrowBook : ControllerBase
{
    public readonly DBContextUser context;

    public BorrowBook(DBContextUser context)
    {
        this.context = context;
    }
    [HttpPost]
    [Authorize]
    public async Task<ActionResult> Post([FromBody] BorrowBookModel borrowBookModel)
    {
        if (ModelState.IsValid)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!string.IsNullOrEmpty(userId))
            {
                var unavailableProducts = new List<object[]>();

                foreach (var o in borrowBookModel.BorrowingDetailsModel)
                {
                    var pros = await context.Product.FirstOrDefaultAsync(p => p.ID_Product == o.ID_Product);
                    if (pros != null && pros.Count_Product >= o.CountBorrowing)
                    {

                    }
                    else
                    {

                        unavailableProducts.Add(new object[] { o.ID_Product, pros.Name_Product });
                    }
                }

                if (unavailableProducts.Count == borrowBookModel.BorrowingDetailsModel.Count)
                {
                    return BadRequest($"Sản phẩm với tên {string.Join(", ", unavailableProducts.Select(p => p[1]))} không còn đủ số lượng để mượn.");
                }
                var newLoans = new Loans
                {
                    Id = userId,
                };
                context.Loans.Add(newLoans);
                await context.SaveChangesAsync();
                foreach (var o in borrowBookModel.BorrowingDetailsModel)
                {
                    var loanDetail = new BorrowingDetails
                    {
                        ID_Loans = newLoans.ID_Loans,
                        ID_Product = o.ID_Product,
                        Count = o.CountBorrowing,
                    };

                    context.BorrowingDetails.Add(loanDetail);
                }

                await context.SaveChangesAsync();
                var Email = User.FindFirstValue(ClaimTypes.Email);
                string tableRows = "";
                var NameUser = User.FindFirstValue(ClaimTypes.Name);
                foreach (var o in borrowBookModel.BorrowingDetailsModel)
                {
                    var prod = context.Product.FirstOrDefault(p => p.ID_Product == o.ID_Product);
                    tableRows += $@"
                        <tr>
                            <td  style='border: 1px solid #dddddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>{prod.Name_Product}</td>
                            <td  style='border: 1px solid #dddddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>{o.CountBorrowing}</td>
                        </tr>";
                }
                string body = $@"
                <html>
                <body>
                   <div style='font-family: Arial, sans-serif; text-align: center; margin: 50px;'>
                        <div style='background-color: #d4edda; border-color: #c3e6cb; color: #155724; padding: 20px; border: 1px solid transparent; border-radius: 5px; margin-bottom: 20px;'>
                            <h2>Xin chào {NameUser}</h2>
                            <h2>Đơn mượn sách đã được đặt thành công!</h2>
                            <p>Mã đơn hàng: {newLoans.ID_Loans}</p>
                            <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ được xử lý sớm nhất.</p>
                            <table style='width: 80%; margin: 20px auto; border-collapse: collapse;'>
                                <thead>
                                    <tr>
                                        <th style='border: 1px solid #dddddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>Tên Sản Phẩm</th>
                                        <th style='border: 1px solid #dddddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>Số Lượng Mượn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </body>
                </html>
                ";
                string Subject = "Mượn sách";
                SendEmail sendEmail = new SendEmail(Email, body, Subject);
                sendEmail.Send();
                return Ok("Thêm thành công");
            }
            else
            {
                return BadRequest("Lỗi");
            }
        }
        else
        {
            return BadRequest("Lỗi ngoài");
        }
    }


}