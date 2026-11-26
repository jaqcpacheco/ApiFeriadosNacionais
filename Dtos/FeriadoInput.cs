namespace ApiFeriadosNacionais.Dtos;

public record FeriadoInput(
    string Nome,
    string Data,
    string Tipo
);