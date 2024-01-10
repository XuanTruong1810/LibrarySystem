using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Fines
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID_Fines { get; set; }
    [StringLength(256)]
    public required int ID_Loans { get; set; }
    public Loans Loans { get; set; }
    public required decimal Total { get; set; }
    public required string Reason { get; set; }
    public required DateTime CreationDate { get; set; }
    public required DateTime FinesDate { get; set; }

    public required bool IsPaid { get; set; }

}