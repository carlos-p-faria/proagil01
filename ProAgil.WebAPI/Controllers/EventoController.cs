using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;

        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // GET api/values
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _repo.GetAllEventoAsync(true);
                var result = _mapper.Map<EventoDto[]>(eventos);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // GET api/values
        [HttpGet("getById/{eventId}")]
        public async Task<IActionResult> Get(int eventId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(eventId, true);
                var result = _mapper.Map<EventoDto>(evento);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // GET api/values
        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                var eventos = await _repo.GetAllEventoAsyncByTema(tema, true);
                var result = _mapper.Map<EventoDto[]>(eventos);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post(EventoDto evento)
        {
            try
            {
                var model = _mapper.Map<Evento>(evento);
                _repo.Add(model);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(model));
                }
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError);
            }

            return BadRequest();
        }

        // PUT api/values
        [HttpPut("{eventId}")]
        public async Task<IActionResult> Put(int eventId, EventoDto evento)
        {
            try
            {
                var model = await _repo.GetEventoAsyncById(eventId, false);
                if (model == null)
                    return NotFound();

                _mapper.Map(evento, model);
                _repo.Update(model);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(model));
                }
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();
        }

        // DELETE api/values
        [HttpDelete("{eventId}")]
        public async Task<IActionResult> Delete(int eventId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(eventId, false);
                if (evento == null)
                    return NotFound();

                _repo.Delete(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();
        }

        // POST api/values
        [HttpPost("upload")]
        public async Task<IActionResult> upload(EventoDto evento)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources/Images");
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                var fullPath = Path.Combine(pathToSave, fileName.Replace("\"","").Trim());

                if (file.Length > 0){
                    using (var stream = new FileStream(fullPath, FileMode.Create)){
                        await file.CopyToAsync(stream);
                    }

                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Upload falhou: {ex.Message}");
            }

            return BadRequest("Erro ao realizar upload");
        }
    }
}