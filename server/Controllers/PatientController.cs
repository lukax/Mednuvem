using Microsoft.AspNetCore.Mvc;
using Server.Core.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using IdSvrHost.Services;
using IdentityServer4.Extensions;

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

    // [Authorize]
    // public class PatientController : Controller
    // {
    //     private PatientRepository _meetingRepository;

    //     public PatientController(PatientRepository meetingRepository)
    //     {
    //         _meetingRepository = meetingRepository;
    //     }

    //     [HttpPost]
    //     public async Task<IActionResult> CreateMeeting([FromBody] CreateMeetingViewModel viewModel)
    //     {
    //         if(viewModel == null || !ModelState.IsValid)
    //         {
    //             ModelState.AddModelError("", "Reunião inválida");
    //             return BadRequest(ModelState);
    //         }
    //         if(viewModel.RequestDate <= DateTime.UtcNow)
    //         {
    //             ModelState.AddModelError("date", "Por favor, especifique uma data para a reunião");
    //         }
    //         if(viewModel.RequestDate >= DateTime.UtcNow.AddDays(30))
    //         {
    //             ModelState.AddModelError("date", "Reuniões só podem ser marcadas com um mês de antecedência.");
    //         }
    //         if (viewModel.RequestHour < new TimeSpan(9, 0, 0) || viewModel.RequestHour > new TimeSpan(16, 0, 0))
    //         {
    //             ModelState.AddModelError("date", "O horário deve ser entre 9h-16h");
    //         }

    //         var alreadyTakenMeetings = await _meetingRepository.GetMeetings(User.GetSubjectId());
    //         if(alreadyTakenMeetings.Any(x => x.MeetingName == viewModel.MeetingName))
    //         {
    //             ModelState.AddModelError("meeting", "Reunião já foi agendada");
    //             return BadRequest(ModelState);
    //         }


    //         var meeting = new Meeting {
    //             Id = Guid.NewGuid().ToString(),
    //             UserId = User.GetSubjectId(),
    //             CreatedAt = DateTime.UtcNow,
    //             MeetingName = viewModel.MeetingName,
    //             Company = viewModel.Company,
    //             Details = viewModel.Details,
    //             RequestDate = viewModel.RequestDate.Date.AddHours(viewModel.RequestHour.Hours),
    //             ScheduleDate = viewModel.RequestDate.Date.AddHours(viewModel.RequestHour.Hours),
    //             Status = "Reunião marcada"
    //         };

    //         await _meetingRepository.CreateMeeting(meeting);

    //         return Ok();
    //     }

    //     [HttpGet]
    //     public async Task<IActionResult> History(){
    //         return Ok((await _meetingRepository.GetMeetings(User.GetSubjectId())).Select(x => 
    //             new { 
    //                 x.MeetingName, 
    //                 x.Company, 
    //                 x.CreatedAt, 
    //                 x.Details, 
    //                 x.Id, 
    //                 x.RequestDate, 
    //                 x.ScheduleDate, 
    //                 x.Status
    //              }));
    //     }

    // }
}
