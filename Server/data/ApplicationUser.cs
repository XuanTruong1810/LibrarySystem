using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string? Image { get; set; }
    public DateTime? Birthday { get; set; }
    public string? Gender { get; set; }
    public List<Loans> Loans { get; set; }
    public LibraryCard LibraryCard { get; set; }
}