using System.ComponentModel.DataAnnotations;

public class Register
{
    [Required(ErrorMessage = "Phải nhập")]
    public required string UserName { get; set; }

    [Required(ErrorMessage = "Phải nhập")]
    public required string Password { get; set; }

    [Required(ErrorMessage = "Phải nhập")]
    [Compare("Password")]
    public required string ConfirmPassword { get; set; }
}




// ///// label 
// ///      @html.labelFor(model=>model.UserName)
// ///   input
// ///     @html.EditorFor(mode=> mode.UserName)
// ///     <p>@html.validationMessageFor(model=>model.UserName)</p>






