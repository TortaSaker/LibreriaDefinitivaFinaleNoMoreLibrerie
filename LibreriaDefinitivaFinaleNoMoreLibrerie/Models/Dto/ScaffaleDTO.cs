using System.ComponentModel.DataAnnotations;

namespace LibreriaDefinitivaFinaleNoMoreLibrerie.Models.Dto
{
    public class ScaffaleDTO
    {
        [Key]
        public string GenereId { get; set; }
        public List<Libro> ScaffaleDiLibri { get; set; }
    }
}
