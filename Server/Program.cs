using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.Cookies;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.Google;
using Hangfire;
using Hangfire.SqlServer;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllersWithViews(options =>
{
    options.MaxModelBindingCollectionSize = int.MaxValue;
});
// builder.Services.AddHangfire(config =>
//    {
//        config.UseSqlServerStorage(builder.Configuration.GetConnectionString("sql"));
//    });



// builder.Services.AddHangfireServer();

builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DBContextUser>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("sql"),
    sqlServerOptionsAction: sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
                       maxRetryCount: 5,
                       maxRetryDelay: TimeSpan.FromSeconds(30),
                       errorNumbersToAdd: null
                   );
    });
});


builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(options =>
{
    options.ClientId = "857257772717-jjl1502m9mblrfoqku9q8k7t0r638lru.apps.googleusercontent.com";
    options.ClientSecret = "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";
});

var MyAllowSpecificOrigins = "AllowSpecificOrigins";
/// Cấu hình cors
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins,
        builder => builder.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());

});

/// Cấu hình Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<DBContextUser>()
    .AddDefaultTokenProviders();
/// Cấu hình JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.WriteIndented = true;

    });
builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".AspNetCore.Correlation.NZ1ykuZooAJ9fleXki__i-Y9vr1ccmp_byfGB0gqH48";
    options.Cookie.SecurePolicy = Microsoft.AspNetCore.Http.CookieSecurePolicy.Always;
    options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None;
});
builder.Services.AddHttpContextAccessor();
var app = builder.Build();
// var recurringJobManager = app.Services.GetRequiredService<IRecurringJobManager>();
// recurringJobManager.AddOrUpdate<LoansService>("YourRecurringJobId",
//        service => service.CheckAndApplyPenaltyForOverdueLoans(),
//       "* * * * * *");
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<DBContextUser>();
        context.Database.EnsureCreated();
    }
}

app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();
app.MapControllers();

app.Run();
