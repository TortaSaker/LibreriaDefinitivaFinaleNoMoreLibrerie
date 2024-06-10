using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibreriaDefinitivaFinaleNoMoreLibrerie.Models
{
    public class Scaffale
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ScaffaleId { get; set; }
        public string Genere { get; set; }
        public List<Libro> ScaffaleDiLibri { get; set; }
    }
}
