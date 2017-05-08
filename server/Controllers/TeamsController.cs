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
using System.ComponentModel.DataAnnotations;
using server;
using WebSocketManager.Common;

namespace Server.Core.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class TeamsController : Controller
    {
        private TeamRepository _teamRepository;
        private UserRepository _userRepository;
        private UserUtilService _userUtilService;
        private string UserId => User.GetSubjectId();

        public TeamsController(TeamRepository teamRepository, UserRepository userRepository, UserUtilService userUtilService)
        {
            _teamRepository = teamRepository;
            _userRepository = userRepository;
            _userUtilService = userUtilService;
        }

        [HttpPost("")]
        public async Task<IActionResult> CreateTeam([FromBody] CreateTeamViewModel viewModel)
        {
            if(viewModel == null || !ModelState.IsValid)
            {
                ModelState.AddModelError("", "Dados inválidos.");
                return BadRequest(ModelState);
            }
            
            var user = _userRepository.GetUserById(UserId);

            var team = await _teamRepository.FindOneById(_userUtilService.GetTeamId(User));
            if(team == null || team.Members.Count == 0)
            {
                team = new Team {
                    Id = Guid.NewGuid().ToString(),
                    Name = user.Company,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Members = new List<TeamMember> {
                        new TeamMember { UserId = user.Id, Role = "owner" }
                    }
                };
                await _teamRepository.InsertOne(team);
            }
            else
            {
                return BadRequest("Não foi possível criar uma equipe.");
            }


            return Ok();
        }

        [HttpPost("Member")]
        public async Task<IActionResult> AddMember([FromBody] AddTeamMemberViewModel viewModel)
        {
            if(viewModel == null || !ModelState.IsValid)
            {
                ModelState.AddModelError("", "Dados inválidos.");
                return BadRequest(ModelState);
            }
            
            var user = _userRepository.GetUserByUsername(viewModel.Email);
            if(user == null)
            {
                return BadRequest("Nenhum usuário encontrado");
            }

            var team = await _teamRepository.FindOneById(_userUtilService.GetTeamId(User));
            if(team == null)
            {
                return BadRequest("Nenhuma equipe encontrada.");
            }

            var existingMember = team.Members.FirstOrDefault(x => x.UserId == user.Id);
            if(existingMember == null)
            {
                team.Members.Add(new TeamMember{
                    UserId = user.Id,
                    Role = "collaborator",
                });

                await _teamRepository.UpdateOne(team);
            } 
            else 
            {
                return BadRequest("Usuário já faz parte da equipe.");
            }

            return Ok();
        }        
        
        [HttpDelete("{teamId}/Member/{memberUserId}")]
        public async Task<IActionResult> RemoveMember(string teamId, string memberUserId)
        {
            if(teamId == null || memberUserId == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user =  _userRepository.GetUserById(memberUserId);
            if(user == null) {
                return BadRequest("Usuário não encontrado.");
            }

            var team = await _teamRepository.FindOneById(_userUtilService.GetTeamId(User));
            if(team == null) {
                return BadRequest("Equipe não encontrada.");
            }

            var member = team.Members.FirstOrDefault(x => x.UserId == memberUserId);
            if(member == null) {
                return BadRequest("Nenhum usuário encontrado.");
            }
            if(member.UserId != UserId && !team.Members.Any(x => x.UserId == UserId && x.Role == "owner")) {
                return BadRequest("Você não possui permissões para editar os dados da equipe.");
            }
            team.Members.Remove(member);
            
            if(team.Members.Count == 1) {
                team.Members.First().Role = "owner";
            }

            if(team.Members.Any()) {
                await _teamRepository.UpdateOne(team);
            } else {
                await _teamRepository.DeleteOne(team.Id);
            }
            
            return Ok();
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll()
        {
            var team = await _teamRepository.FindOneByUserIdAsync(UserId);
            if(team == null) {
                return Ok();
            }

            var usrs = await _userRepository.GetUserById(team.Members.Select(x => x.UserId).ToArray());

            return Ok(new {
                team.Id,
                team.Name,
                team.CreatedAt,
                team.UpdatedAt,
                Messages = team.Messages.Select(x => new
                {
                    UserId = x.UserId,
                    UserName = usrs.FirstOrDefault(usr => usr.Id == x.UserId)?.Name ?? "Desconhecido",
                    UserEmail = usrs.FirstOrDefault(usr => usr.Id == x.UserId)?.Email,
                    Message = x.Message,
                    SentAt = x.SentAt,
                }),
                Members = usrs.Select(x => new {
                        UserId = x.Id,
                        Name = x.Name,
                        Role = team.Members.First(m => m.UserId == x.Id).Role,
                        Email = x.Email,
                        IsOnline = x.IsOnline,
                        EmailHash = MD5Util.CreateMD5(x.Email),
                    }).ToList()
            });
        }


    }

    public class AddTeamMemberViewModel 
    {
        [Required]
        public string Email { get; set; }
        
    }

    public class CreateTeamViewModel
    {
        [Required]
        public string Name { get; set; }
    }
}
