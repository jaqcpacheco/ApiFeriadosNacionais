using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseDefaultFiles();
app.UseStaticFiles();

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


app.MapGet("/api/feriados/{id:int}", async (int id, ApiDbContext db) =>
{
    var feriado = await db.Feriados.FindAsync(id);
    if (feriado is null) {return Results.NotFound();}

    return Results.Ok(feriado);
});

// Listar 
app.MapPut("/api/feriados/{id:int}", async (int id, FeriadosNacionaisEntity entrada, ApiDbContext db) =>
{
    var feriado = await db.Feriados.FindAsync(id);
    if (feriado is null) {return Results.NotFound();}

    feriado.Nome = entrada.Nome;
    feriado.Data = entrada.Data;
    feriado.Tipo = entrada.Tipo;

    await db.SaveChangesAsync();
    return Results.Ok(feriado);
});

// Listar feriados deletados
app.MapDelete("/api/feriados/{id:int}", async (int id, ApiDbContext db) =>
{
    var feriado = await db.Feriados.FindAsync(id);
    if (feriado is null) {return Results.NotFound();}

    db.Feriados.Remove(feriado);
    await db.SaveChangesAsync();
    return Results.NoContent();
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