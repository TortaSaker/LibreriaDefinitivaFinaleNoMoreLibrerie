using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibreriaDefinitivaFinaleNoMoreLibrerie.Models
{
    public class Libro
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LibroId { get; set; }    
        [Required]
        [MaxLength(17)]
        [MinLength(10)]
        public string Isbn { get; set; }
        public string Titolo { get; set; }
        public string Autore { get; set; }
        public string Genere { get; set; }
        public string Edizione { get; set; } //Einaudi(2019)
        public double Prezzo { get; set; }
        public int Quantita { get; set; }
        public int ScaffaleId { get; set; }
        public Scaffale? Scaffale { get; set; }
    }
}
