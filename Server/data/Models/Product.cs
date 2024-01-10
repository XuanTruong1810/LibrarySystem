using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Product
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Required]
    public int ID_Product { get; set; }
    [StringLength(256)]
    public required string Name_Product { get; set; }
    public required int Count_Product { get; set; }
    [StringLength(50)]

    [Column(TypeName = "ntext")]
    public string? Description { get; set; }
    public DateTime PublicationDate { get; set; }
    [Column(TypeName = "text")]
    public string? Image { get; set; }
    public int ID_Brand { get; set; }
    public Brand Brand { get; set; }
    public int ID_Author { get; set; }
    public Author Author { get; set; }
    public int ID_PublishingCompany { get; set; }
    public PublishingCompany PublishingCompany { get; set; }
    public bool Is_delete { get; set; }

    public List<BorrowingDetails> BorrowingDetails { get; set; }
}