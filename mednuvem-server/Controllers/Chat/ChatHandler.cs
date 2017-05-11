using System.Net.WebSockets;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using IdSvrHost.Models;
using server.Models;
using WebSocketManager;
using WebSocketManager.Common;
using System;
using System.Linq;
using IdentityServer4.Extensions;
using IdSvrHost.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Server.Core.Controllers.Chat
{
    public class ChatHandler : WebSocketHandler
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserRepository _userRepository;
        private readonly TeamRepository _teamRepository;
        private string UserId
        {
            get
            {
                var user = _httpContextAccessor?.HttpContext?.User;
                if (user != null && user.IsAuthenticated())
                {
                    string userId = user.GetSubjectId();
                    return userId;
                }
                return null;
            }
        }


        public ChatHandler(
            IHttpContextAccessor httpContextAccessor,
            UserRepository userRepository,
            TeamRepository teamRepository,
            WebSocketConnectionManager webSocketConnectionManager) 
            : base(webSocketConnectionManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _userRepository = userRepository;
            _teamRepository = teamRepository;
        }

        public override async Task OnConnected(WebSocket socket)
        {
            await base.OnConnected(socket);
            if (UserId == null) return;

            _userRepository.SetOnlineStatus(UserId, true, WebSocketConnectionManager.GetId(socket));

            var team = await _teamRepository.FindOneByUserIdAsync(UserId);
            var teamMembers = await _userRepository.FindManyByUserIdAsync(team.Members.Select(x => x.UserId).ToArray());

            foreach (var memberSocketId in teamMembers.Select(x => x.SocketId).Distinct())
            {
                //if (!member.IsOnline) return;
                await InvokeClientMethodToAllAsync("refresh", memberSocketId, new Message()
                {
                    MessageType = MessageType.Text,
                    Data = "Update"
                });
            }
        }

        public async Task SendMessage(string socketId, string message)
        {
            if (UserId == null) return;

            var chatMessage = await _teamRepository.AddMessageToTeam(UserId, message);

            var team = await _teamRepository.FindOneByUserIdAsync(UserId);
            var teamMembers = await _userRepository.FindManyByUserIdAsync(team.Members.Select(x => x.UserId).ToArray());

            foreach (var memberSocketId in teamMembers.Select(x => x.SocketId).Distinct())
            {
                //if (!member.IsOnline) return;
                await InvokeClientMethodToAllAsync("receiveMessage", memberSocketId, new
                {
                    UserId = chatMessage.UserId,
                    UserName = teamMembers.FirstOrDefault(usr => usr.Id == UserId)?.Name ?? "Desconhecido",
                    UserEmail = teamMembers.FirstOrDefault(usr => usr.Id == UserId)?.Email,
                    Message = chatMessage.Message,
                    SentAt = chatMessage.SentAt,
                });
            }
       }

        public override async Task OnDisconnected(WebSocket socket)
        {
            await base.OnDisconnected(socket);
            if (UserId == null) return;

            _userRepository.SetOnlineStatus(UserId, false, WebSocketConnectionManager.GetId(socket));

            var team = await _teamRepository.FindOneByUserIdAsync(UserId);
            var teamMembers = await _userRepository.FindManyByUserIdAsync(team.Members.Select(x => x.UserId).ToArray());

            foreach (var memberSocketId in teamMembers.Select(x => x.SocketId).Distinct())
            {
                //if (!member.IsOnline) return;
                await InvokeClientMethodToAllAsync("refresh", memberSocketId, new Message()
                {
                    MessageType = MessageType.Text,
                    Data = "Update"
                });
            }
        }
    }
}
