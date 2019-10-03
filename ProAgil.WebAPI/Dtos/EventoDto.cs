using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Tema { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Range(1,200,ErrorMessage = "Deve estar entre 1 e 200")]
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }

        [Phone(ErrorMessage ="O valor informado no campo {0} é inválido")]
        public string Telefone { get; set; }

        [EmailAddress(ErrorMessage ="Informe um e-mail válido")]
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}