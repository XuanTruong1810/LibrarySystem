using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("BorrowingDetails")]
public class BorrowingDetails
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID_BorrowingDetails { get; set; }
    public int Count { get; set; }
    public int ID_Product { get; set; }
    public int ID_Loans { get; set; }

    public Product Product { get; set; }
    public Loans Loans { get; set; }
}