using System;
using System.Security.Claims;
using System.Linq;
using Server.Core;
using IdSvrHost.Services;
using IdentityServer4.Extensions;
using MongoDB.Driver;

namespace server.Services
{
    public class UserUtilService
    {
        private TeamRepository _teamRepository;
        private UserRepository _userRepository;

        public UserUtilService(
            UserRepository userRepository,
            TeamRepository teamRepository) 
        {
            _userRepository = userRepository;
            _teamRepository = teamRepository;
        }

        public string GetTeamId(ClaimsPrincipal user)
        {
            if(user != null) {
                return _teamRepository.FindOneByUserId(user.GetSubjectId()).Result?.Id;
            }
            return null;
        }

    }
}
