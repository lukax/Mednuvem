using System;
using System.Security.Claims;
using System.Linq;
using Server.Core;

namespace server.Services
{
    public static class UserUtilService
    {
        public static string GetTeamId(this ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(x => x.Type == Config.TeamIdClaimType)?.Value;
        }

    }
}
