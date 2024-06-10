using LibreriaDefinitivaFinaleNoMoreLibrerie.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace LibreriaDefinitivaFinaleNoMoreLibrerie.Database
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Scaffale> Scaffali { get; set; }
        public DbSet<Libro> Libri { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Scaffale>(entity =>
            {
                entity.Property(e => e.ScaffaleId)
                      .ValueGeneratedOnAdd();
            });

            modelBuilder.Entity<Libro>(entity =>
            {
                entity.Property(e => e.LibroId)
                      .ValueGeneratedOnAdd();
            });

            var scaffali = SeedScaffali();

            modelBuilder.Entity<Scaffale>().HasData(scaffali.Select((s, index) => new Scaffale
            {
                ScaffaleId = (index + 1),
                Genere = s.Genere
            }));
            modelBuilder.Entity<Libro>()
                .HasIndex(l => l.Isbn)
                .IsUnique();

            var libroIdCounter = 1;
            foreach (var scaffale in scaffali)
            {
                modelBuilder.Entity<Libro>().HasData(
                    scaffale.ScaffaleDiLibri.Select(libro =>
                    {
                        var uniqueLibroId = libroIdCounter++;
                        return new Libro
                        {
                            LibroId = uniqueLibroId,
                            Isbn = libro.Isbn,
                            Titolo = libro.Titolo,
                            Autore = libro.Autore,
                            Genere = libro.Genere,
                            Edizione = libro.Edizione,
                            Prezzo = libro.Prezzo,
                            Quantita = libro.Quantita,
                            ScaffaleId = (scaffali.FindIndex(s => s.Genere == libro.Genere) + 1)
                        };
                    }).ToArray());
            }
        }

        private List<Scaffale> SeedScaffali()
        {
            var lines = File.ReadAllLines("Libri.csv");

            if (lines.Length <= 1)
            {
                throw new Exception("Il file CSV è vuoto");
            }

            var libri = lines.Skip(1)
                             .Select(line => line.Split(';'))
                             .Select(parts =>
                             {
                                 if (parts.Length < 7)
                                 {
                                     throw new Exception("Riga non valida nel CSV" + lines);
                                 }

                                 return new Libro
                                 {
                                     Isbn = parts[0],
                                     Titolo = parts[1],
                                     Autore = parts[2],
                                     Genere = parts[3],
                                     Edizione = parts[4],
                                     Prezzo = double.Parse(parts[5]),
                                     Quantita = int.Parse(parts[6])
                                 };
                             })
                             .ToList();

            var genres = libri.Select(l => l.Genere)
                              .Distinct()
                              .ToList();

            var scaffali = genres.Select((g, i) => new Scaffale
            {
                Genere = g,
                ScaffaleDiLibri = libri.Where(l => l.Genere == g).ToList()
            }).ToList();

            return scaffali;
        }
    }
}