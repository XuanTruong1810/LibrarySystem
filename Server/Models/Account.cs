using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AccountRegister
{
    public required string UserName { get; set; }
    [EmailAddress]
    public required string Email { get; set; }
    public required string Password { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? Birthday { get; set; }
    public string? Gender { get; set; }

}
public class AccountLogin
{
    [EmailAddress]
    public required string Email { get; set; }
    public required string Password { get; set; }
}
public class AccountUser
{
    public required string UserName { get; set; }
    public string? Telephone { get; set; }
    public DateTime? Birthday { get; set; }
    public string? Gender { get; set; }
}