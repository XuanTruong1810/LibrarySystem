using MailKit.Net.Smtp;
using MimeKit;

public class SendEmail
{
    public string Email;
    public string BodyEmail;
    public string Subject;
    public SendEmail(string Email, string BodyEmail, string Subject)
    {
        this.Email = Email;
        this.BodyEmail = BodyEmail;
        this.Subject = Subject;
    }
    public void Send()
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse("truongtamcobra@gmail.com"));
        email.To.Add(MailboxAddress.Parse(this.Email));
        email.Subject = this.Subject;
        string emailBody = this.BodyEmail;
        email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = emailBody };
        using var smtp = new SmtpClient();
        smtp.Connect("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
        smtp.Authenticate("truongtamcobra@gmail.com", "dtmp kxqc wfzn qcqn");
        smtp.Send(email);
        smtp.Disconnect(true);
    }
}