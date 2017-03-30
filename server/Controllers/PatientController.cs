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

namespace Server.Core.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    public class PatientsController : Controller
    {
        private PatientRepository _patientRepository;
        private string UserId => null;

        public PatientsController(PatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] PatientViewModel viewModel)
        {
            if(viewModel == null || !ModelState.IsValid)
            {
                ModelState.AddModelError("", "Paciente inválido");
                return BadRequest(ModelState);
            }
            if(Convert.ToDateTime(viewModel.BirthDate) > DateTime.UtcNow)
            {
                ModelState.AddModelError("date", "Data de nascimento inválida");
            }
            if(Convert.ToDateTime(viewModel.LastAppointment) > DateTime.UtcNow)
            {
                ModelState.AddModelError("date", "Última consulta inválida");
            }
            var alreadyTakenMeetings = await _patientRepository.FindByName(UserId, viewModel.Name);
            if(alreadyTakenMeetings.Any())
            {
                ModelState.AddModelError("meeting", "Já existe um paciente com o mesmo nome");
                return BadRequest(ModelState);
            }
            var result = await _patientRepository.InsertOne(viewModel.ToPatient());
            if(result.IsError){
                return BadRequest(result.Message);
            }
            return Ok(result.Message);
        }

        [HttpPut("{patientId}")]
        public async Task<IActionResult> Update(string patientId, [FromBody] PatientViewModel viewModel)
        {
            if(viewModel == null || !ModelState.IsValid)
            {
                ModelState.AddModelError("", "Paciente inválido");
                return BadRequest(ModelState);
            }
            if(Convert.ToDateTime(viewModel.BirthDate) > DateTime.UtcNow)
            {
                ModelState.AddModelError("date", "Data de nascimento inválida");
            }
            if(Convert.ToDateTime(viewModel.LastAppointment) > DateTime.UtcNow)
            {
                ModelState.AddModelError("date", "Última consulta inválida");
            }
            var alreadyTakenMeetings = await _patientRepository.FindByName(UserId, viewModel.Name);
            if(alreadyTakenMeetings.Any())
            {
                ModelState.AddModelError("meeting", "Já existe um paciente com o mesmo nome");
                return BadRequest(ModelState);
            }
            var result = await _patientRepository.UpdateOne(viewModel.ToPatient(patientId));
            if(result.IsError){
                return BadRequest(result.Message);
            }
            return Ok(result.Message);
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll(int pageSize = 50, int pageNumber = 1, string orderBy = "", string search = "")
        {
            return Ok(await _patientRepository.GetAll(UserId, pageSize, pageNumber, orderBy, search));
        }

        [HttpDelete("{patientId}")]
        public async Task<IActionResult> FindOne(string patientId){
            return Ok(await _patientRepository.FindOne(UserId, patientId));
        }

        [HttpGet("{patientId}")]
        public async Task<IActionResult> DeleteOne(string patientId){
            var result = await _patientRepository.DeleteOne(UserId, patientId);
            if(result.IsError){
                return BadRequest(result.Message);
            }
            return Ok(result.Message);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IList<IFormFile> files) 
        {
            var formFile = files[0];
            long size = formFile.Length;

            // full path to file in temp location
            //var filePath = Path.GetTempFileName();
            IList<Patient> records = null;
            if (formFile.Length > 0)
            {
                try {
                    var stream = new MemoryStream();
                    await formFile.CopyToAsync(stream);
                    stream.Position = 0;
                    var textReader = new StreamReader(stream);
                    var csv = new CsvReader( textReader );
                    records = csv.GetRecords<PatientViewModel>().Select(x =>
                        {
                            if(x.Name == null) return null;
                            return x.ToPatient();
                        }).Where(x => x != null).ToList();
                } 
                catch(Exception ex)
                {
                    return BadRequest("Could not read import file. " + ex.Message);    
                }

                try {
                    foreach(var r in records){
                        await _patientRepository.InsertOne(r);
                    }
                }
                catch(Exception ex) 
                {
                    return BadRequest("Could not save patient record. " + ex.Message);
                }
            }
            return Ok(new { count = records?.Count });
        }
        
    }
}
