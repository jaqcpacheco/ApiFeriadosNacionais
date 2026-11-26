namespace ApiFeriadosNacionais.Models;

public class FeriadosNacionaisEntity
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Data { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
}