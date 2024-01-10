using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PublishingCompany
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID_PublishingCompany { get; set; }
    [StringLength(256)]
    public required string Name_PublishingCompany { get; set; }
    public List<Product> Products { get; set; }
}