using AutoMapper;
using ProAgil.Domain;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDto>();
            CreateMap<Lote, LoteDto>();
            CreateMap<Palestrante, PalestranteDto>();
            CreateMap<RedeSocial, RedeSocialDto>();
        }
    }
}