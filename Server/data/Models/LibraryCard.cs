using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class LibraryCard
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID_LibraryCard { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime ProductionDate { get; set; }
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime ExpirationDate { get; set; }
    public int Status { get; set; }
    [StringLength(450)]
    public required string Id { get; set; }

    public ApplicationUser ApplicationUser { get; set; }
}