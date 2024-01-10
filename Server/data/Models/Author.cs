using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Author
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID_Author { get; set; }
    [StringLength(256)]
    [Required]
    public required string Name_Author { get; set; }
    public List<Product> Products { get; set; }

}