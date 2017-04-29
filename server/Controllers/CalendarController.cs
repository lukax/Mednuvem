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
        private string TeamId => User.GetTeamId();

        public CalendarController(CalendarEventRepository calendarEventRepository)
        {
            _calendarEventRepository = calendarEventRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] CalendarEvent viewModel)
        {
            if(viewModel == null || !ModelState.IsValid)
            {
                ModelState.AddModelError("", "Paciente inválido.");
                return BadRequest(ModelState);
            }
            if(Convert.ToDateTime(viewModel.End) > DateTime.UtcNow)
            {
                ModelState.AddModelError("end", "Data de término inválida.");
            }
            viewModel.Id = Guid.NewGuid().ToString();
            viewModel.TeamId = TeamId;
            viewModel.CreatedAt = DateTime.UtcNow;
            viewModel.UpdatedAt = DateTime.UtcNow;

            var result = await _calendarEventRepository.InsertOne(TeamId, viewModel);
            if(result.IsError){
                return BadRequest(result);
            }
            return Json(viewModel.Id);
        }

        [HttpPut("{patientId}")]
        public async Task<IActionResult> Update(string patientId, [FromBody] CalendarEvent viewModel)
        {
            if(viewModel == null || !ModelState.IsValid)
            {
                ModelState.AddModelError("", "Paciente inválido.");
                return BadRequest(ModelState);
            }
            if(Convert.ToDateTime(viewModel.End) > DateTime.UtcNow)
            {
                ModelState.AddModelError("end", "Data de término inválida.");
            }
            viewModel.Id = patientId;
            viewModel.TeamId = TeamId;
            viewModel.UpdatedAt = DateTime.UtcNow;

            var result = await _calendarEventRepository.UpdateOne(TeamId, viewModel);
            if(result.IsError){
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll(int pageSize = 50, int pageNumber = 1, string orderBy = "", string search = "")
        {
            return Ok(await _calendarEventRepository.GetAll(TeamId, pageSize, pageNumber, orderBy, search));
        }

        [HttpGet("{patientId}")]
        public async Task<IActionResult> FindOne(string patientId){
            var p = await _calendarEventRepository.FindOne(TeamId, patientId);
            if(p == null) {
                return NotFound();
            }
            return Ok(p);
        }

        [HttpDeleteAttribute("{patientId}")]
        public async Task<IActionResult> DeleteOne(string patientId){
            var result = await _calendarEventRepository.DeleteOne(TeamId, patientId);
            if(result.IsError){
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
