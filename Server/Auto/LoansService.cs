using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class LoansService
{
    private readonly DBContextUser context;
    private readonly UserManager<ApplicationUser> userManager;

    public LoansService(DBContextUser context, UserManager<ApplicationUser> userManager)
    {
        this.context = context;
        this.userManager = userManager;
    }
    public async Task CheckAndApplyPenaltyForOverdueLoans()
    {
        var overdueLoans = await context.Loans
            .Where(loan => loan.MAXBorrowingDay < DateTime.Today && (loan.Status == 2 || loan.Status == 4))
            .ToListAsync();

        if (overdueLoans != null)
        {
            foreach (var loans in overdueLoans)
            {
                var checkLoansFines = await context.Fines.FirstOrDefaultAsync(p => p.ID_Loans == loans.ID_Loans);
                if (loans.Status == 4 && checkLoansFines != null)
                {
                    var existingFine = await context.Fines.FirstOrDefaultAsync(f => f.ID_Loans == loans.ID_Loans);
                    var daysPassed = (DateTime.Today - existingFine.CreationDate).TotalDays;
                    if (!existingFine.IsPaid && daysPassed >= 7 && DateTime.Today > existingFine.FinesDate && daysPassed <= 90)
                    {
                        existingFine.Total += 5000;
                        if (existingFine.FinesDate.AddDays(7) > DateTime.Today)
                        {
                            var dayAdd = (DateTime.Today - existingFine.FinesDate).TotalDays;
                            existingFine.FinesDate = existingFine.FinesDate.AddDays(dayAdd);
                        }
                        else
                        {

                            existingFine.FinesDate = existingFine.FinesDate.AddDays(7);
                        }
                    }
                    if (daysPassed >= 90 && !existingFine.IsPaid)
                    {
                        var user = await userManager.FindByIdAsync(loans.Id);

                        if (user != null)
                        {
                            var isLockedOut = await userManager.IsLockedOutAsync(user);
                            if (!isLockedOut)
                            {
                                var lockoutEndDate = DateTimeOffset.UtcNow.AddYears(100);
                                await userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
                                var LibraryCard = await context.LibraryCard.FirstOrDefaultAsync(p => p.Id == loans.Id);
                                if (LibraryCard != null)
                                {
                                    LibraryCard.Status = 5;
                                }
                            }
                        }
                    }
                }
                else
                {
                    loans.Status = 4;
                    Fines newFines = new()
                    {
                        ID_Loans = loans.ID_Loans,
                        CreationDate = DateTime.Today,
                        FinesDate = DateTime.Today,
                        IsPaid = false,
                        Reason = "Quá hạn mượn sách",
                        Total = 5000,
                    };
                    await context.AddAsync(newFines);
                }

                await context.SaveChangesAsync();
            }
        }
    }
}

