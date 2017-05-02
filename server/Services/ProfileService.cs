using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Server.Core;

namespace IdSvrHost.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserRepository _repository;

        public ProfileService(IUserRepository repository)
        {
            _repository = repository;
        }

        public Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var subjectId = context.Subject.GetSubjectId();

            var user = _repository.GetUserById(subjectId);

            var claims = new List<Claim>
            {
                new Claim(JwtClaimTypes.Subject, user.Id),
                new Claim(JwtClaimTypes.Name, $"{user.GetFirstName()} {user.GetLastName()}"),
                new Claim(JwtClaimTypes.GivenName, user.GetFirstName()),
                new Claim(JwtClaimTypes.FamilyName, user.GetLastName()),
                new Claim(JwtClaimTypes.Email, user.Email),
				new Claim(JwtClaimTypes.EmailVerified, user.EmailVerified.ToString().ToLower(), ClaimValueTypes.Boolean),
				new Claim(Config.CompanyClaimType, user.Company),
            };

            context.IssuedClaims = claims;

            return Task.FromResult(0);
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            var user = _repository.GetUserById(context.Subject.GetSubjectId());

            context.IsActive = (user != null) && user.IsActive;
            return Task.FromResult(0);
        }
    }
}
