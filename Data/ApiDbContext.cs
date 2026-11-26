using Microsoft.EntityFrameworkCore;
using ApiFeriadosNacionais.Models;

namespace ApiFeriadosNacionais.Data;

public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options)
        : base(options)
    {
    }

    public DbSet<FeriadosNacionaisEntity> Feriados =>
        Set<FeriadosNacionaisEntity>();
}