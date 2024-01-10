using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Brand
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID_Brand { get; set; }
    [StringLength(256)]
    public required string Name_Brand { get; set; }
    public List<Product> Products { get; set; }
}