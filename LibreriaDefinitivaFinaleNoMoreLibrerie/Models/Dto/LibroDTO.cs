using System.ComponentModel.DataAnnotations;

namespace LibreriaDefinitivaFinaleNoMoreLibrerie.Models.Dto
{
    public class LibroDTO
    {
        [Required]
        [MaxLength(17)]
        [MinLength(10)]
        public string Isbn { get; set; }
        public string Titolo { get; set; }
        public string Autore { get; set; }
        public string Genere { get; set; }
        public double Prezzo { get; set; }
        public int Quantita { get; set; }
        public string Edizione { get; set; } //Einaudi(2019)
    }
}
