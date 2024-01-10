using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("/api/[controller]/[action]")]
[Authorize(Roles = "Admin")]
public class ManagerController : ControllerBase
{
    private readonly DBContextUser context;
    private readonly UserManager<ApplicationUser> userManager;
    private readonly SignInManager<ApplicationUser> signInManager;
    private readonly RoleManager<IdentityRole> roleManager;

    public ManagerController(DBContextUser context, UserManager<ApplicationUser> userManager,
     SignInManager<ApplicationUser> signInManager, RoleManager<IdentityRole> roleManager)
    {
        this.context = context;
        this.userManager = userManager;
        this.signInManager = signInManager;
        this.roleManager = roleManager;
    }
    [HttpGet]

    public ActionResult GetAllUser()
    {
        var Users = context.Users.ToList();
        return Ok(Users);
    }
    [HttpDelete]

    public async Task<ActionResult> DeleteUser([FromBody] List<string> listId)
    {
        foreach (var userId in listId)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user != null)
            {
                var result = await userManager.DeleteAsync(user);

                if (result.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    return NotFound("Xóa k thành công");
                }
            }
            else
            {
                return NotFound("Khong tim thay");
            }
        }
        return NotFound("lôi");

    }

    [HttpGet]

    public ActionResult GetAllProduct()
    {
        var productsWithBrand = context.Product
         .Where(p => p.Is_delete == false)
         .Join(context.Brand,
             product => product.ID_Brand,
             brand => brand.ID_Brand,
             (product, brand) => new
             {
                 product.ID_Product,
                 product.Name_Product,
                 product.Count_Product,
                 product.Description,
                 product.Image,
                 brand.Name_Brand
             })
         .ToList();

        return Ok(productsWithBrand);
    }
    [HttpPost]

    public ActionResult AddProduct([FromBody] ProductModel newProduct)
    {

        var addProduct = new Product
        {
            Name_Product = newProduct.Name_Product,
            Count_Product = newProduct.CountProduct,
            ID_Brand = newProduct.ID_Brand,
            Image = newProduct.Image,
            PublicationDate = newProduct.PublicationDate,
            ID_Author = newProduct.ID_Author,
            ID_PublishingCompany = newProduct.ID_PublishingCompany,
            Description = newProduct.Description,
        };
        context.Product.Add(addProduct);
        context.SaveChanges();
        return Ok("Add Success");
    }
    [HttpPut]

    public ActionResult UpdateProduct([FromQuery] int id, [FromBody] ProductModel updateProduct)
    {
        var product = context.Product
            .Include(p => p.Author)
            .Include(p => p.PublishingCompany)
            .Include(p => p.Brand)
            .FirstOrDefault(p => p.ID_Product == id);

        if (product == null)
        {
            return NotFound();
        }


        product.Name_Product = updateProduct.Name_Product;
        product.Count_Product = updateProduct.CountProduct;
        product.Description = updateProduct.Description;
        product.PublicationDate = updateProduct.PublicationDate;
        product.Image = updateProduct.Image;

        if (product.Brand.ID_Brand != updateProduct.ID_Brand)
        {
            var newBrand = context.Brand.FirstOrDefault(b => b.ID_Brand == updateProduct.ID_Brand);
            if (newBrand != null)
            {
                product.Brand = newBrand;
            }
        }

        if (product.Author.ID_Author != updateProduct.ID_Author)
        {
            var newAuthor = context.Author.FirstOrDefault(a => a.ID_Author == updateProduct.ID_Author);
            if (newAuthor != null)
            {
                product.Author = newAuthor;
            }
        }

        if (product.PublishingCompany.ID_PublishingCompany != updateProduct.ID_PublishingCompany)
        {
            var newPublishingCompany = context.PublishingCompany.FirstOrDefault(pc => pc.ID_PublishingCompany == updateProduct.ID_PublishingCompany);
            if (newPublishingCompany != null)
            {
                product.PublishingCompany = newPublishingCompany;
            }
        }

        context.SaveChanges();
        return Ok("Thành công");
    }
    [HttpDelete]

    public ActionResult DeleteProduct([FromQuery] int id)
    {
        var deleteProduct = context.Product.Where(p => p.ID_Product == id)
            .FirstOrDefault();
        if (deleteProduct != null)
        {
            deleteProduct.Is_delete = true;
            context.SaveChanges();
            return Ok("Xóa thành công");
        }
        else
        {
            return NotFound("Xóa không thành công");
        }
    }
    [HttpPut]

    public ActionResult AcceptOrder([FromQuery] int id)
    {
        var status = context.Loans.Where(order => order.ID_Loans == id).FirstOrDefault();
        var orderAccept = context.Loans.Where(order => order.ID_Loans == id)
            .Include(p => p.ApplicationUser)
            .Include(p => p.BorrowingDetails)
            .Select(p => new
            {
                p.Status,
                p.ApplicationUser.UserName,
                p.ApplicationUser.Email,
                p.BorrowingDetails,
            }).FirstOrDefault();
        if (status != null && orderAccept != null)
        {
            status.Status = 1;
            context.SaveChanges();
            var Email = orderAccept.Email;
            string tableRows = "";
            var NameUser = orderAccept.UserName;
            foreach (var o in orderAccept.BorrowingDetails)
            {
                var prod = context.Product.FirstOrDefault(p => p.ID_Product == o.ID_Product);
                tableRows += $@"
                        <tr>
                            <td  style='border: 1px solid #dddddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>{prod.Name_Product}</td>
                            <td  style='border: 1px solid #dddddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>{o.Count}</td>
                        </tr>";
            }
            string body = $@"
                <html>
                <body>
                   <div style='font-family: Arial, sans-serif; text-align: center; margin: 50px;'>
                        <div style='background-color: #d4edda; border-color: #c3e6cb; color: #155724; padding: 20px; border: 1px solid transparent; border-radius: 5px; margin-bottom: 20px;'>
                            <h2>Xin chào {NameUser}</h2>
                            <h2>Đơn hàng của quý khác đã được xác nhận</h2>
                            <p>Mã đơn hàng: {status.ID_Loans}</p>
                            <p>Cảm ơn bạn đã mượn sách tại thư viện chúng tôi. Xin mời quý khác đến thư viện chúng tôi để nhận sách</p>
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
        }
        return Ok("Thành công");
    }
    [HttpPut]

    public ActionResult AcceptOrderBorrowBook([FromQuery] int id)
    {
        var status = context.Loans.Where(order => order.ID_Loans == id).FirstOrDefault();
        var orderAccept = context.Loans.Where(order => order.ID_Loans == id)
            .Include(p => p.ApplicationUser)
            .Include(p => p.BorrowingDetails)
            .Select(p => new
            {
                p.ApplicationUser.UserName,
                p.ApplicationUser.Email,
                p.BorrowingDetails,
            }).FirstOrDefault();
        if (status != null && orderAccept != null)
        {
            status.Status = 2;
            context.SaveChanges();
            var Email = orderAccept.Email;
            string tableRows = "";
            var NameUser = orderAccept.UserName;
            foreach (var o in orderAccept.BorrowingDetails)
            {
                var prod = context.Product.FirstOrDefault(p => p.ID_Product == o.ID_Product);
                tableRows += $@"
                        <tr>
                            <td  style='border: 1px solid #dddddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>{prod.Name_Product}</td>
                            <td  style='border: 1px solid #dddddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>{o.Count}</td>
                        </tr>";
            }
            string body = $@"
                <html>
                <body>
                   <div style='font-family: Arial, sans-serif; text-align: center; margin: 50px;'>
                        <div style='background-color: #d4edda; border-color: #c3e6cb; color: #155724; padding: 20px; border: 1px solid transparent; border-radius: 5px; margin-bottom: 20px;'>
                            <h2>Xin chào {NameUser}</h2>
                            <h2>Quý khách mượn sách thành công</h2>
                            <p>Mã đơn hàng: {status.ID_Loans}</p>
                            <p>Cảm ơn bạn đã mượn sách tại thư viện chúng tôi. Chúc quý khác đọc sách vui vẻ</p>
                            <p>Ngày tối đa trả sách là: {status.MAXBorrowingDay}</p>
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
        }
        return Ok("Thành công");
    }
    [HttpPut]

    public ActionResult BookReturned([FromQuery] int id)
    {
        var status = context.Loans.Where(order => order.ID_Loans == id).FirstOrDefault();
        var orderAccept = context.Loans.Where(order => order.ID_Loans == id)
            .Include(p => p.ApplicationUser)
            .Include(p => p.BorrowingDetails)
            .Select(p => new
            {
                p.ID_Loans,
                p.ApplicationUser.UserName,
                p.ApplicationUser.Email,
                p.BorrowingDetails,
            }).FirstOrDefault();
        if (orderAccept != null && status != null)
        {
            var orderDetail = context.BorrowingDetails.Where(p => p.ID_Loans == orderAccept.ID_Loans)
                .Include(p => p.Product)
                .Select(p => new
                {
                    p.Count,
                    p.ID_Product,
                    p.Product.Name_Product,
                }).ToList();
            if (orderDetail != null)
            {
                orderDetail.ForEach(o =>
                           {
                               var a = context.Product.Where(p => p.ID_Product == o.ID_Product).FirstOrDefault();
                               a.Count_Product += o.Count;
                               context.SaveChanges();
                           });
                status.Status = 3;
                status.PayDay = DateTime.Now;
                var fines = context.Fines.Where(p => p.ID_Loans == id).FirstOrDefault();
                if (fines != null)
                {
                    fines.IsPaid = true;
                }
                context.SaveChanges();
                var Email = orderAccept.Email;
                string tableRows = "";
                var NameUser = orderAccept.UserName;
                foreach (var o in orderAccept.BorrowingDetails)
                {
                    var prod = context.Product.FirstOrDefault(p => p.ID_Product == o.ID_Product);
                    tableRows += $@"
                        <tr>
                            <td  style='border: 1px solid #dddddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>{prod.Name_Product}</td>
                            <td  style='border: 1px solid #dddddd; padding: 8px; text-align: left; background-color: #f2f2f2;'>{o.Count}</td>
                        </tr>";
                }
                string body = $@"
                <html>
                <body>
                   <div style='font-family: Arial, sans-serif; text-align: center; margin: 50px;'>
                        <div style='background-color: #d4edda; border-color: #c3e6cb; color: #155724; padding: 20px; border: 1px solid transparent; border-radius: 5px; margin-bottom: 20px;'>
                            <h2>Xin chào {NameUser}</h2>
                            <h2>Quý khách trả sách thành công</h2>
                            <p>Mã đơn hàng: {status.ID_Loans}</p>
                            <p>Cảm ơn bạn đã mượn sách tại thư viện chúng tôi.</p>
                            <p>Ngày tối trả sách là: {status.PayDay}</p>
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
                return Ok("Thành công");
            }
            else
            {
                return BadRequest("Lỗi");
            }


        }
        return Ok("Thành công");
    }

    [HttpGet]
    public async Task<ActionResult> GetAllProductOrder([FromQuery] int id)
    {
        var details = await context.BorrowingDetails
            .Where(o => o.ID_Loans == id)
            .Select(o => new
            {
                NameProduct = o.Product.Name_Product,
                ImageUrl = o.Product.Image,
                QuantityOrdered = o.Count,
            })
            .ToListAsync();
        var detailsFines = await context.Fines.Where(p => p.ID_Loans == id).FirstOrDefaultAsync();
        if (detailsFines != null)
        {
            var result = new
            {
                details,
                detailsFines.Reason,
                detailsFines.Total,
            };
            return Ok(result);
        }
        else
        {
            return Ok(new { details });
        }
    }

    [HttpDelete]

    public ActionResult DeleteOrder([FromQuery] int id)
    {
        var orderAccept = context.Loans.Where(order => order.ID_Loans == id).FirstOrDefault();
        if (orderAccept != null)
        {
            context.Remove(orderAccept);
            context.SaveChanges();
        }
        return Ok();
    }
    [HttpPost]

    public ActionResult AddBrand([FromQuery] string name)
    {

        var brands = context.Brand.Where(b => b.Name_Brand == name).FirstOrDefault();

        if (brands != null)
        {
            return BadRequest("Đã tồn tại");
        }
        else
        {
            Brand newBrand = new()
            {
                Name_Brand = name,
            };
            context.Brand.Add(newBrand);
            context.SaveChanges();

            return Ok("Thêm thành công");
        }
    }
    [HttpPost]

    public ActionResult AddPublisher([FromQuery] string name)
    {

        var Publisher = context.PublishingCompany.Where(b => b.Name_PublishingCompany == name).FirstOrDefault();

        if (Publisher != null)
        {
            return BadRequest("Đã tồn tại");
        }
        else
        {
            PublishingCompany newPublisher = new()
            {
                Name_PublishingCompany = name,
            };
            context.PublishingCompany.Add(newPublisher);
            context.SaveChanges();

            return Ok("Thêm thành công");
        }
    }

    [HttpPost]
    public ActionResult AddAuthor([FromQuery] string name)
    {
        var Authors = context.Author.Where(b => b.Name_Author == name).FirstOrDefault();

        if (Authors != null)
        {
            return BadRequest("Đã tồn tại");
        }
        else
        {
            Author newAuthor = new Author()
            {
                Name_Author = name,
            };
            context.Author.Add(newAuthor);
            context.SaveChanges();

            return Ok("Thêm thành công");
        }
    }
    [HttpGet]

    public async Task<ActionResult> Report()
    {
        var usersWithUserRole = await userManager.GetUsersInRoleAsync("User");
        var accountCount = usersWithUserRole.Count;
        var products = await context.Product.Where(p => p.Is_delete == false).SumAsync(p => p.Count_Product);
        var soldProductCount = await context.BorrowingDetails.SumAsync(p => p.Count);
        var mostSoldProduct = await context.BorrowingDetails
            .GroupBy(b => b.ID_Product)
            .OrderByDescending(g => g.Sum(p => p.Count))
            .Select(g => g.Key)
            .FirstOrDefaultAsync();
        var productInfo = await context.Product
            .FirstOrDefaultAsync(p => p.ID_Product == mostSoldProduct);
        if (productInfo != null)
        {
            var stats = new
            {
                UserCount = accountCount,
                ProductCount = products,
                SoldProductCount = soldProductCount,
                ProductName = productInfo.Name_Product,
            };
            return Ok(stats);
        }
        return NotFound();

    }

    [HttpGet]
    public async Task<IActionResult> GetLoginStats()
    {
        var facebookLoginsCount = await context.UserLogins.CountAsync(l => l.LoginProvider == "Facebook");
        var googleLoginsCount = await context.UserLogins.CountAsync(l => l.LoginProvider == "Google");

        var usersWithUserRole = userManager.GetUsersInRoleAsync("User").Result;
        var regularUsersCount = usersWithUserRole.Count(user =>
            !userManager.GetLoginsAsync(user).Result.Any(login =>
                login.LoginProvider == "Facebook" || login.LoginProvider == "Google")
        );
        var stats = new
        {
            FacebookLoginsCount = facebookLoginsCount,
            GoogleLoginsCount = googleLoginsCount,
            RegularUsersCount = regularUsersCount
        };

        return Ok(stats);
    }

    [HttpGet]
    public IActionResult GetOrderStatistics(
       int startYear, int startMonth, int startDay,
       int endYear, int endMonth, int endDay)
    {
        try
        {
            DateTime startDate = new(startYear, startMonth, startDay);
            DateTime endDate = new(endYear, endMonth, endDay);


            var salesData = context.BorrowingDetails
            .Include(b => b.Loans)
            .Where(o => o.Loans.BorrowingDay >= startDate && o.Loans.BorrowingDay <= endDate
                    && o.Loans.Status == 2)
            .ToList();

            var monthlySales = salesData
                .GroupBy(s => new { s.Loans.BorrowingDay.Year, s.Loans.BorrowingDay.Month })
                .Select(g => new
                {
                    MonthYear = $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month)} {g.Key.Year}",
                    TotalSales = g.Sum(s => s.Count)
                })
                .OrderBy(g => g.MonthYear)
                .ToList();

            return Ok(monthlySales);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetRecentFourWeeksOrderStatistics()
    {
        DateTime today = DateTime.Today;

        var recentFourWeeksOrders = await context.BorrowingDetails
            .Include(b => b.Loans)
            .Where(o => o.Loans.BorrowingDay >= today.AddDays(-28))
            .OrderByDescending(o => o.Loans.BorrowingDay)
            .ToListAsync();

        var weeklySummaries = recentFourWeeksOrders
            .GroupBy(o => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(o.Loans.BorrowingDay, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday))
            .OrderBy(g => g.Key)
            .Select(g => new
            {
                WeekNumber = "Tuần " + g.Key,
                TotalRevenue = g.Sum(o => o.Count)
            })
            .ToList();

        var lastFourWeeks = weeklySummaries.TakeLast(4).ToList();

        return Ok(lastFourWeeks);





    }

    [HttpGet]
    public ActionResult GetYearlyOrderStatistics([FromQuery] int Year)
    {
        DateTime startDate = new(Year, 1, 1);
        DateTime endDate = new(Year, 12, 31);

        var monthlyStatistics = context.BorrowingDetails
            .Include(b => b.Loans)
            .Where(o => o.Loans.BorrowingDay >= startDate && o.Loans.BorrowingDay <= endDate)
            .ToList();

        var twelveMonths = new List<object>();
        for (int i = 0; i < 12; i++)
        {
            DateTime startMonth = startDate.AddMonths(i);
            DateTime endMonth = startMonth.AddMonths(1);

            int booksBorrowedInMonth = monthlyStatistics
                .Where(b => b.Loans.BorrowingDay >= startMonth && b.Loans.BorrowingDay < endMonth)
                .Sum(b => b.Count);

            twelveMonths.Add(new
            {
                Month = $"Tháng {startMonth.Month}",
                BooksBorrowedCount = booksBorrowedInMonth
            });
        }

        return Ok(twelveMonths);
    }




    [HttpGet]
    public ActionResult GetHourlyBooksBorrowedStatistic()
    {
        DateTime today = DateTime.Today;
        DateTime startOfDay = today.Date;
        DateTime endOfDay = startOfDay.AddDays(1);

        var hourlyBooksBorrowed = new List<object>();

        var borrowingDetailsOfDay = context.BorrowingDetails
            .Include(b => b.Loans)
            .Where(b => b.Loans.BorrowingDay >= startOfDay && b.Loans.BorrowingDay < endOfDay)
            .ToList();

        for (int i = 0; i < 24; i += 2)
        {
            DateTime startHour = startOfDay.AddHours(i);
            DateTime endHour = startHour.AddHours(2);

            int booksBorrowedInHour = borrowingDetailsOfDay
                .Where(b => b.Loans.BorrowingDay >= startHour && b.Loans.BorrowingDay < endHour)
                .Sum(b => b.Count);
            hourlyBooksBorrowed.Add(new
            {
                Hour = $"{startHour.Hour}:00 - {endHour.Hour}:00",
                BooksBorrowedCount = booksBorrowedInHour
            });
        }

        return Ok(hourlyBooksBorrowed);
    }
    [HttpPost]

    public async Task<ActionResult> BorrowBook([FromQuery] string id, [FromBody] BorrowBookModel borrowBookModel)
    {
        if (!ModelState.IsValid)
        {
            return NotFound("Dữ liệu không đúng");
        }
        var userId = await context.Users.Where(p => p.Id == id).FirstOrDefaultAsync();
        if (userId != null)
        {
            Loans newLoans = new()
            {
                Id = userId.Id,
                Status = 2,
            };
            context.Loans.Add(newLoans);
            context.SaveChanges();
            borrowBookModel.BorrowingDetailsModel.ForEach(values =>
            {
                BorrowingDetails details = new()
                {
                    ID_Loans = newLoans.ID_Loans,
                    ID_Product = values.ID_Product,
                    Count = values.CountBorrowing,
                };
                context.BorrowingDetails.Add(details);
                context.SaveChanges();
            });
            var Email = userId.Email;
            string tableRows = "";
            var NameUser = userId.UserName;
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
                            <h2>Quý khách mượn sách thành công</h2>
                            <p>Mã đơn hàng: {newLoans.ID_Loans}</p>
                            <p>Cảm ơn bạn đã mượn sách tại thư viện chúng tôi. Chúc quý khác đọc sách vui vẻ</p>
                            <p>Ngày tối đa trả sách là: {newLoans.MAXBorrowingDay}</p>
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
            return Ok("thành công");
        }
        return BadRequest("LỖi dữ liệu");
    }
    [HttpPost]

    public async Task<ActionResult> Register([FromBody] AccountRegister register)
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
                Birthday = register.Birthday,
                PhoneNumber = register.PhoneNumber,
                Gender = register.Gender,
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
                    Status = 1,
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
    [HttpGet]

    public async Task<ActionResult> GetAllCart()
    {
        var ListCart = await context.LibraryCard.Include(p => p.ApplicationUser)
            .Select(cart => new
            {
                cart.ID_LibraryCard,
                cart.ExpirationDate,
                cart.ProductionDate,
                cart.Status,
                Username = cart.ApplicationUser.UserName,
            }).ToListAsync();

        return Ok(ListCart);
    }
    [HttpPut]


    public ActionResult AcceptLibraryCart([FromQuery] int id)
    {
        var LibraryCardAccept = context.LibraryCard.Where(LibraryCard => LibraryCard.ID_LibraryCard == id).FirstOrDefault();
        if (LibraryCardAccept != null)
        {
            LibraryCardAccept.Status = 2;
            context.SaveChanges();
        }
        return Ok("Thành công");
    }
    [HttpPut]

    public ActionResult AcceptGetsLibraryCart([FromQuery] int id)
    {
        var LibraryCardAccept = context.LibraryCard.Where(LibraryCard => LibraryCard.ID_LibraryCard == id).FirstOrDefault();
        if (LibraryCardAccept != null)
        {
            LibraryCardAccept.Status = 3;
            context.SaveChanges();
        }
        return Ok("Thành công");
    }
}

