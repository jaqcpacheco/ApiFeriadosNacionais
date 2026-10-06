using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

// Rota raiz
app.MapGet("/", () =>
{
    return Results.Ok(new
    {
        mensagem = "API de Feriados Nacionais está no ar!"
    });
});

// Cadastrar novo feriado no banco de dados
app.MapPost("/api/feriados", async (
    FeriadosNacionaisEntity feriado,
    ApiDbContext db) =>
{
    db.Feriados.Add(feriado);

    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/feriados/{feriado.Id}",
        feriado
    );
});

// Listar todos os feriados do banco de dados
app.MapGet("/api/feriados", async (ApiDbContext db) =>
    await db.Feriados.ToListAsync()
);

app.Run();


class FeriadosNacionaisEntity
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public string Data { get; set; } = string.Empty;

    public string Tipo { get; set; } = string.Empty;
}


class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options)
        : base(options)
    {
    }

    public DbSet<FeriadosNacionaisEntity> Feriados =>
        Set<FeriadosNacionaisEntity>();
}