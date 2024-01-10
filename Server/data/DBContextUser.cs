using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class DBContextUser : IdentityDbContext<ApplicationUser>
{
    public DbSet<Brand> Brand { get; set; }
    public DbSet<Author> Author { get; set; }
    public DbSet<PublishingCompany> PublishingCompany { get; set; }
    public DbSet<Product> Product { get; set; }

    public DbSet<Loans> Loans { get; set; }
    public DbSet<BorrowingDetails> BorrowingDetails { get; set; }
    public DbSet<LibraryCard> LibraryCard { get; set; }
    public DbSet<Fines> Fines { get; set; }

    public DBContextUser(DbContextOptions<DBContextUser> options) : base(options)
    {

    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<ApplicationUser>().ToTable("User");
        builder.Entity<IdentityRole>().ToTable("Role");
        builder.Entity<IdentityUserRole<string>>().ToTable("UserRole");
        builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaim");
        builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogin");
        builder.Entity<IdentityUserToken<string>>().ToTable("UserToken");
        builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaim");

        builder.Entity<Brand>();
        builder.Entity<Loans>();
        builder.Entity<BorrowingDetails>();
        builder.Entity<Product>();
        builder.Entity<LibraryCard>();
        builder.Entity<PublishingCompany>();
        builder.Entity<Author>();
        builder.Entity<Fines>();

        builder.Entity<Product>()
            .HasOne(p => p.Brand)
            .WithMany(p => p.Products)
            .HasForeignKey(p => p.ID_Brand);
        builder.Entity<Product>()
            .HasOne(p => p.PublishingCompany)
            .WithMany(p => p.Products)
            .HasForeignKey(p => p.ID_PublishingCompany);

        builder.Entity<Product>()
            .HasOne(p => p.Author)
            .WithMany(p => p.Products)
            .HasForeignKey(p => p.ID_Author);

        builder.Entity<Loans>()
            .HasOne(p => p.ApplicationUser)
            .WithMany(p => p.Loans)
            .HasForeignKey(p => p.Id);
        builder.Entity<BorrowingDetails>()
            .HasOne(p => p.Product)
            .WithMany(p => p.BorrowingDetails)
            .HasForeignKey(p => p.ID_Product);

        builder.Entity<BorrowingDetails>()
            .HasOne(p => p.Loans)
            .WithMany(p => p.BorrowingDetails)
            .HasForeignKey(p => p.ID_Loans);

        builder.Entity<LibraryCard>()
            .HasOne(l => l.ApplicationUser)
            .WithOne(l => l.LibraryCard)
            .HasForeignKey<LibraryCard>(u => u.Id);
        builder.Entity<Fines>()
            .HasOne(f => f.Loans)
            .WithOne(f => f.Fines)
            .HasForeignKey<Fines>(u => u.ID_Loans);

        builder.Entity<Loans>()
            .Property(o => o.BorrowingDay)
            .HasDefaultValueSql("GETDATE()");
        builder.Entity<LibraryCard>()
            .Property(o => o.ProductionDate)
            .HasDefaultValueSql("GETDATE()");
        builder.Entity<LibraryCard>()
            .Property(o => o.ExpirationDate)
            .HasComputedColumnSql("DATEADD(year, 2, ProductionDate)");
        builder.Entity<Loans>()
            .Property(o => o.MAXBorrowingDay)
            .HasComputedColumnSql("DATEADD(month, 1, BorrowingDay)");

        builder.Entity<Product>()
            .Property(p => p.Is_delete)
            .HasDefaultValue(0);
        builder.Entity<LibraryCard>()
            .Property(p => p.Status)
            .HasDefaultValue(0);

        builder.Entity<BorrowingDetails>(entry =>
                 {
                     entry.ToTable("BorrowingDetails", tb => tb.HasTrigger("UpdateProductQuantity"));
                 });

    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }
}