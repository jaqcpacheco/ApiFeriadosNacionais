
using Microsoft.EntityFrameworkCore;
using ApiFeriadosNacionais.Models;
using ApiFeriadosNacionais.Dtos;
using ApiFeriadosNacionais.Data;

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

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            mensagem = "Ocorreu um erro interno. Tente novamente mais tarde."
        });
    });
});

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
    FeriadoInput entrada,
    ApiDbContext db) =>
{
    var feriado = new FeriadosNacionaisEntity
    {
        Nome = entrada.Nome,
        Data = entrada.Data,
        Tipo = entrada.Tipo
    };

    db.Feriados.Add(feriado);

    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/feriados/{feriado.Id}",
        feriado
    );
});

// Buscar feriado por ID
app.MapGet("/api/feriados/{id:int}", async (int id, ApiDbContext db) =>
{
    var feriado = await db.Feriados.FindAsync(id);
    if (feriado is null) { return Results.NotFound(); }

    return Results.Ok(feriado);
});

// Atualizar feriado
app.MapPut("/api/feriados/{id:int}", async (int id, FeriadoInput entrada, ApiDbContext db) =>
{
    var feriado = await db.Feriados.FindAsync(id);
    if (feriado is null) { return Results.NotFound(); }

    feriado.Nome = entrada.Nome;
    feriado.Data = entrada.Data;
    feriado.Tipo = entrada.Tipo;

    await db.SaveChangesAsync();
    return Results.Ok(feriado);
});

// Excluir feriado
app.MapDelete("/api/feriados/{id:int}", async (int id, ApiDbContext db) =>
{
    var feriado = await db.Feriados.FindAsync(id);
    if (feriado is null) { return Results.NotFound(); }

    db.Feriados.Remove(feriado);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Listar todos os feriados do banco de dados
app.MapGet("/api/feriados", async (ApiDbContext db) =>
    await db.Feriados.ToListAsync()
);

app.Run();
