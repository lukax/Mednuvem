using Microsoft.AspNetCore.Mvc;
using Server.Core.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using IdSvrHost.Services;
using System.Collections.Generic;
using System.IO;
using CsvHelper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using IdentityServer4.Extensions;
using server.Services;

namespace Server.Core.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class CalendarController : Controller
    {
        private CalendarEventRepository _calendarEventRepository;
        private UserUtilService _userUtilService;

        public CalendarController(CalendarEventRepository calendarEventRepository, UserUtilService userUtilService)
        {
            _calendarEventRepository = calendarEventRepository;
            _userUtilService = userUtilService;
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] CalendarEvent viewModel)
        {
            if(viewModel == null || !ModelState.IsValid)
            {
                ModelState.AddModelError("", "Paciente inválido.");
                return BadRequest(ModelState);
            }
            if(viewModel.Start < DateTime.UtcNow)
            {
                ModelState.AddModelError("start", "Data de início inválida.");
            }
            if(viewModel.End > DateTime.UtcNow || viewModel.Start > viewModel.End)
            {
                ModelState.AddModelError("end", "Data de término inválida.");
            }
            viewModel.Id = Guid.NewGuid().ToString();
            viewModel.TeamId = _userUtilService.GetTeamId(User);
            viewModel.CreatedAt = DateTime.UtcNow;
            viewModel.UpdatedAt = DateTime.UtcNow;

            var result = await _calendarEventRepository.InsertOne(viewModel);
            if(result.IsError){
                return BadRequest(result);
            }
            return Json(viewModel.Id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] CalendarEvent viewModel)
        {
            if(viewModel == null || !ModelState.IsValid)
            {
                ModelState.AddModelError("", "Paciente inválido.");
                return BadRequest(ModelState);
            }
            if(viewModel.Start < DateTime.UtcNow)
            {
                ModelState.AddModelError("start", "Data de início inválida.");
            }
            if(viewModel.End > DateTime.UtcNow || viewModel.Start > viewModel.End)
            {
                ModelState.AddModelError("end", "Data de término inválida.");
            }
            viewModel.Id = id;
            viewModel.TeamId = _userUtilService.GetTeamId(User);
            viewModel.UpdatedAt = DateTime.UtcNow;

            var result = await _calendarEventRepository.UpdateOne(viewModel);
            if(result.IsError){
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll(int pageSize = 50, int pageNumber = 1, string orderBy = "", string search = "")
        {
            return Ok(await _calendarEventRepository.GetAll(_userUtilService.GetTeamId(User), pageSize, pageNumber, orderBy, search));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> FindOne(string id){
            var p = await _calendarEventRepository.FindOne(_userUtilService.GetTeamId(User), id);
            if(p == null) {
                return NotFound();
            }
            return Ok(p);
        }

        [HttpDeleteAttribute("{id}")]
        public async Task<IActionResult> DeleteOne(string id){
            var result = await _calendarEventRepository.DeleteOne(_userUtilService.GetTeamId(User), id);
            if(result.IsError){
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
