using Azure;
using LibreriaDefinitivaFinaleNoMoreLibrerie.Controllers;
using LibreriaDefinitivaFinaleNoMoreLibrerie.Database;
using LibreriaDefinitivaFinaleNoMoreLibrerie.Models;
using LibreriaDefinitivaFinaleNoMoreLibrerie.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LibreriaDefinitivaFinaleNoMoreLibrerie.Controllers
{
    public class LibroController : BaseAPIController
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<LibroController> _logger;

        public LibroController(ILogger<LibroController> logger, ApplicationDbContext db)
        {
            _db = db;
            _logger = logger;
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [HttpGet("GetAllLibri", Name = "GetAllLibri")]
        public IActionResult GetAllBooks()
        {
            _logger.LogInformation("Get tutti i libri nella libreria");
            var books = _db.Scaffali.SelectMany(s => s.ScaffaleDiLibri);

            if (books == null || !books.Any())
            {
                return NoContent();
            }

            return Ok(books.ToList());
        }

        [HttpPost("{isbn}/{titolo}/{autore}/{genere}/{prezzo}/{quantita}/{edizione}")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult AddBook(string isbn, string titolo, string autore, string genere, double prezzo, int quantita, string edizione)
        {
            if (string.IsNullOrWhiteSpace(isbn) || string.IsNullOrWhiteSpace(titolo) || string.IsNullOrWhiteSpace(autore) || string.IsNullOrWhiteSpace(genere))
            {
                return BadRequest(new { error = "Tutti i campi devono essere compilati" });
            }

            var libroTrovato = _db.Libri.FirstOrDefault(l => l.Isbn == isbn);

            if (libroTrovato != null)
            {
                libroTrovato.Quantita += quantita;
                _db.SaveChanges();
                return CreatedAtRoute("SearchBooks", new { query = isbn }, libroTrovato);
            }
            else
            {
                var scaffale = _db.Scaffali.FirstOrDefault(s => s.Genere.ToLower() == genere.ToLower());
                if (scaffale == null)
                {
                    scaffale = new Scaffale
                    {
                        Genere = genere,
                        ScaffaleDiLibri = new List<Libro>()
                    };
                    _db.Scaffali.Add(scaffale);
                }

                Libro model = new Libro
                {
                    Isbn = isbn,
                    Titolo = titolo,
                    Autore = autore,
                    Prezzo = prezzo,
                    Genere = genere,
                    Edizione = edizione,
                    Quantita = quantita,
                    ScaffaleId = scaffale.ScaffaleId,
                    Scaffale = scaffale
                };

                _db.Libri.Add(model);
                _db.SaveChanges();
                return CreatedAtRoute("SearchBooks", new { query = isbn }, model);
            }
        }

        [HttpGet("{query}", Name = "SearchBooks")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult SearchBooks(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { error = "Il parametro di ricerca non può essere vuoto" });
            }

            string lowerQuery = query.ToLower();

            double parsedPrice;
            bool isNumeric = double.TryParse(query, out parsedPrice);

            var books = _db.Scaffali
                            .SelectMany(s => s.ScaffaleDiLibri)
                            .Where(b => b.Titolo.ToLower().Contains(lowerQuery) ||
                                        b.Autore.ToLower().Contains(lowerQuery) ||
                                        b.Isbn.Contains(query) ||
                                        b.Genere.ToLower() == lowerQuery ||
                                        (isNumeric && b.Prezzo <= parsedPrice))
                            .ToList();

            if (!books.Any())
            {
                return NotFound(new { error = "Non sono presenti libri con queste caratteristiche" });
            }

            return Ok(books);
        }



        [HttpPatch("{isbn}/{quantita}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult RemoveBooks(string isbn, int quantita)
        {
            if (string.IsNullOrWhiteSpace(isbn))
            {
                return BadRequest(new { error = "ISBN non può essere vuoto" });
            }
            var libroTrovato = _db.Libri.FirstOrDefault(l => l.Isbn == isbn);

            if (libroTrovato == null)
            {
                _logger.LogError("Nessun libro trovato con ISBN : " + isbn);
                return BadRequest(new { error = "Nessun libro trovato con ISBN : " + isbn });
            }

            if (quantita > libroTrovato.Quantita)
            {
                _logger.LogError("La quantità passata è maggiore di quella vendibile");
                return BadRequest(new { error = "La quantità che si desidera comprare è maggiore di quella presente nel magazzino." });
            }

            libroTrovato.Quantita -= quantita;

            if (libroTrovato.Quantita == 0)
            {
                _db.Libri.Remove(libroTrovato);
            }

            _db.SaveChanges();

            return libroTrovato.Quantita == 0 ? NoContent() : Ok(libroTrovato);
        }
    }
}
