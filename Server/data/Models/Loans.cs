using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Loans
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID_Loans { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime BorrowingDay { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime MAXBorrowingDay { get; set; }

    public DateTime? PayDay { get; set; }

    public int Status { get; set; }
    [StringLength(450)]
    public required string Id { get; set; }
    public ApplicationUser ApplicationUser { get; set; }
    public Fines Fines { get; set; }
    public List<BorrowingDetails> BorrowingDetails { get; set; }

}