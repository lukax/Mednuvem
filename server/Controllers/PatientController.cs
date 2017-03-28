using Microsoft.AspNetCore.Mvc;
using Server.Core.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using IdSvrHost.Services;
using IdentityServer4.Extensions;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http.Internal;
using System.IO;
using CsvHelper;
using Microsoft.AspNetCore.Http;

namespace Server.Core.Controllers
{
    // public class CreateMeetingViewModel
    // {
    //     [Required(ErrorMessage = "A data da reunião é necessário")]
    //     public DateTime RequestDate { get; set; }

    //     [Required(ErrorMessage = "O horário da reunião é necessário")]
    //     public TimeSpan RequestHour { get; set; }

    //     [Required(ErrorMessage = "O tipo de reunião é necessário")]
    //     public string MeetingName { get; set; }

    //     [Required(AllowEmptyStrings = false, ErrorMessage = "O nome da empresa é necessário")]
    //     public string Company { get; set; }

    //     public string Details { get; set; }
    // }

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

        // [HttpPost]
        // public async Task<IActionResult> CreateMeeting([FromBody] CreateMeetingViewModel viewModel)
        // {
        //     if(viewModel == null || !ModelState.IsValid)
        //     {
        //         ModelState.AddModelError("", "Reunião inválida");
        //         return BadRequest(ModelState);
        //     }
        //     if(viewModel.RequestDate <= DateTime.UtcNow)
        //     {
        //         ModelState.AddModelError("date", "Por favor, especifique uma data para a reunião");
        //     }
        //     if(viewModel.RequestDate >= DateTime.UtcNow.AddDays(30))
        //     {
        //         ModelState.AddModelError("date", "Reuniões só podem ser marcadas com um mês de antecedência.");
        //     }
        //     if (viewModel.RequestHour < new TimeSpan(9, 0, 0) || viewModel.RequestHour > new TimeSpan(16, 0, 0))
        //     {
        //         ModelState.AddModelError("date", "O horário deve ser entre 9h-16h");
        //     }
        //     var alreadyTakenMeetings = await _meetingRepository.GetMeetings(User.GetSubjectId());
        //     if(alreadyTakenMeetings.Any(x => x.MeetingName == viewModel.MeetingName))
        //     {
        //         ModelState.AddModelError("meeting", "Reunião já foi agendada");
        //         return BadRequest(ModelState);
        //     }
        //     var meeting = new Meeting {
        //         Id = Guid.NewGuid().ToString(),
        //         UserId = User.GetSubjectId(),
        //         CreatedAt = DateTime.UtcNow,
        //         MeetingName = viewModel.MeetingName,
        //         Company = viewModel.Company,
        //         Details = viewModel.Details,
        //         RequestDate = viewModel.RequestDate.Date.AddHours(viewModel.RequestHour.Hours),
        //         ScheduleDate = viewModel.RequestDate.Date.AddHours(viewModel.RequestHour.Hours),
        //         Status = "Reunião marcada"
        //     };
        //     await _meetingRepository.CreateMeeting(meeting);
        //     return Ok();
        // }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll(int pageSize = 50, int pageNumber = 1, string orderBy = "", string search = "")
        {
            return Ok(await _patientRepository.GetAll(UserId, pageSize, pageNumber, orderBy, search));
        }

        [HttpGet("{patientId}")]
        public async Task<IActionResult> FindOne(string patientId){
            return Ok(await _patientRepository.FindOne(UserId, patientId));
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IList<IFormFile> files) 
        {
            var formFile = files[0];
            long size = formFile.Length;

            // full path to file in temp location
            //var filePath = Path.GetTempFileName();
            if (formFile.Length > 0)
            {
                IList<Patient> records = null;
                try {
                    var stream = new MemoryStream();
                    await formFile.CopyToAsync(stream);
                    stream.Position = 0;
                    var textReader = new StreamReader(stream);
                    var csv = new CsvReader( textReader );
                    records = csv.GetRecords<PatientViewModel>().Select(x =>
                        {
                            if(x.Name == null) return null;
                            DateTime birthDate;
                            DateTime lastAppointment;
                            bool birthDateOk = DateTime.TryParse(x.BirthDate, out birthDate);
                            bool lastAppointmentOk = DateTime.TryParse(x.LastAppointment, out lastAppointment);
                            return new Patient{
                                Name = x.Name,
                                Email = x.Email,
                                Address = x.Address,
                                MedicalInsurance = x.MedicalInsurance,
                                PhoneNumber = x.PhoneNumber,
                                AccountablePerson = x.AccountablePerson,
                                BirthDate = birthDateOk ? birthDate : default(DateTime?),
                                LastAppointment = lastAppointmentOk ? lastAppointment : default(DateTime?)
                            };

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
                
                // using (var stream = new FileStream(filePath, FileMode.Create))
                // {
                //     await formFile.CopyToAsync(stream);
                // }
            }

            // process uploaded files
            // Don't rely on or trust the FileName property without validation.

            return Ok(new { count = 1/*, size, filePath*/});
        }
        
    }
}
