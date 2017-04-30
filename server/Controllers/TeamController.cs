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
using server.Models;

namespace Server.Core.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class TeamController : Controller
    {
        private TeamRepository _teamRepository;
        private string TeamId => User.GetTeamId();

        public TeamController(TeamRepository teamRepository)
        {
            _teamRepository = teamRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddMember([FromBody] string userEmail)
        {
            if(string.IsNullOrWhiteSpace(userEmail) || !ModelState.IsValid)
            {
                ModelState.AddModelError("", "Email inválido.");
                return BadRequest(ModelState);
            }

            
            return Ok();
        }

    }
}
