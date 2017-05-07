using System.Net.WebSockets;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using IdSvrHost.Models;
using server.Models;
using WebSocketManager;
using WebSocketManager.Common;
using System;
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
        private string UserId => _httpContextAccessor?.HttpContext?.User?.GetSubjectId();


        public ChatHandler(
            IHttpContextAccessor httpContextAccessor,
            UserRepository userRepository,
            WebSocketConnectionManager webSocketConnectionManager) 
            : base(webSocketConnectionManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _userRepository = userRepository;
        }

        public override async Task OnConnected(WebSocket socket)
        {
            if (UserId == null) return;
            await base.OnConnected(socket);

            var user = _userRepository.GetUserById(UserId);

            var socketId = WebSocketConnectionManager.GetId(socket);

            var message = new Message()
            {
                MessageType = MessageType.Text,
                Data = $"{socketId} is now connected"
            };

            await SendMessageToAllAsync(message);
        }

        public async Task SendMessage(string socketId, string message)
        {
            if (UserId == null) return;

            await InvokeClientMethodToAllAsync("receiveMessage", socketId, 
                new TeamChatMessage {
                    Message = message
                });
        }

        public override async Task OnDisconnected(WebSocket socket)
        {
            if (UserId == null) return;
            await base.OnDisconnected(socket);

            var socketId = WebSocketConnectionManager.GetId(socket);

            var message = new Message()
            {
                MessageType = MessageType.Text,
                Data = $"{socketId} disconnected"
            };
            await SendMessageToAllAsync(message);
        }
    }
}
