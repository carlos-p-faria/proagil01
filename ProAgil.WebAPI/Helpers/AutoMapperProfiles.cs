using System.Linq;
using AutoMapper;
using ProAgil.Domain;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDto>()
                .ForMember(dest => dest.Palestrantes, opt => 
                        opt.MapFrom(src => src.PalestrantesEventos.Select(i => i.Palestrante).ToList())
                    )
                .ReverseMap();

            CreateMap<Lote, LoteDto>().ReverseMap();

            CreateMap<Palestrante, PalestranteDto>()
                .ForMember(dest => dest.Eventos, opt => 
                    opt.MapFrom(src => src.PalestrantesEventos.Select(i => i.Evento).ToList())
                    )
                .ReverseMap();

            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
        }
    }
}