var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var feriados = new List<Feriado>
{
    new(1, "Confraternização Universal", "01/01/2026", "Nacional"),
    new(2, "Paixão de Cristo", "03/04/2026", "Nacional"),
    new(3, "Tiradentes", "21/04/2026", "Nacional"),
    new(4, "Dia Mundial do Trabalho", "01/05/2026", "Nacional"),
    new(5, "Independência do Brasil", "07/09/2026", "Nacional"),
    new(6, "Nossa Senhora Aparecida", "12/10/2026", "Nacional"),
    new(7, "Finados", "02/11/2026", "Nacional"),
    new(8, "Proclamação da República", "15/11/2026", "Nacional"),
    new(9, "Dia Nacional de Zumbi e da Consciência Negra", "20/11/2026", "Nacional"),
    new(10, "Natal", "25/12/2026", "Nacional")
};

// Rota raiz
app.MapGet("/", () =>
{
    return Results.Ok(new { mensagem = "API de Feriados Nacionais está no ar!" });
});

// Listar todos os feriados
app.MapGet("/api/feriados", () =>
{
    return Results.Ok(feriados);
});

// Buscar feriado por ID
app.MapGet("/api/feriados/{id:int}", (int id) =>
{
    var feriado = feriados.FirstOrDefault(f => f.Id == id);

    if (feriado is null)
        return Results.NotFound(new { mensagem = "Feriado não encontrado." });

    return Results.Ok(feriado);
});

// Cadastrar novo feriado
app.MapPost("/api/feriados", (FeriadoInputDto dto) =>
{
    var novoId = feriados.Count == 0
        ? 1
        : feriados.Max(f => f.Id) + 1;

    var novoFeriado = new Feriado(
        novoId,
        dto.Nome,
        dto.Data,
        dto.Tipo
    );

    feriados.Add(novoFeriado);

    return Results.Created($"/api/feriados/{novoId}", novoFeriado);
});

// Atualizar feriado
app.MapPut("/api/feriados/{id:int}", (int id, FeriadoInputDto dto) =>
{
    var indice = feriados.FindIndex(f => f.Id == id);

    if (indice == -1)
        return Results.NotFound(new { mensagem = "Feriado não encontrado." });

    var feriadoAtualizado = new Feriado(
        id,
        dto.Nome,
        dto.Data,
        dto.Tipo
    );

    feriados[indice] = feriadoAtualizado;

    return Results.Ok(feriadoAtualizado);
});

// Remover feriado
app.MapDelete("/api/feriados/{id:int}", (int id) =>
{
    var feriado = feriados.FirstOrDefault(f => f.Id == id);

    if (feriado is null)
        return Results.NotFound(new { mensagem = "Feriado não encontrado." });

    feriados.Remove(feriado);

    return Results.NoContent();
});

app.Run();

// DTO completo
record Feriado(
    int Id,
    string Nome,
    string Data,
    string Tipo
);

// DTO de entrada sem ID
record FeriadoInputDto(
    string Nome,
    string Data,
    string Tipo
);