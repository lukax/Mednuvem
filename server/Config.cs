
using System;
using System.Collections.Generic;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;

namespace Server.Core
{
    public class Config
    {
        public const string ApiClientId = "mednuvemApp";
        public const string ApiName = "api";
#if DEBUG
        public const string ApiAuthority = "http://localhost:5000";
#else
        public const string ApiAuthority = "http://mednuvem.azurewebsites.net";
#endif
        public const string CompanyClaimType = "company";

        public static class RoutePaths 
        {
            public const string Consent = "ui/consent";
            public const string CspReport = "csp/report";
            public const string Error = "ui/error";
            public const string Login = "ui/login";
            public const string Logout = "ui/logout";
        }


        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource(Config.ApiName, "Mednuvem API", new List<string> { JwtClaimTypes.Email, JwtClaimTypes.PreferredUserName, JwtClaimTypes.Name, CompanyClaimType })
            };
        }

        public static IEnumerable<Client> GetClients()
        {
            return new List<Client>
            {
                new Client
                {
                    ClientId = Config.ApiClientId,
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,
                    ClientSecrets = 
                    {
                        new Secret("secret".Sha256())
                    },
                    AccessTokenLifetime = 2*30*24*3600,
                    AllowedScopes = { Config.ApiName }
                },

                // // OpenID Connect implicit flow client (MVC)
                // new Client
                // {
                //     ClientId = "mvc",
                //     ClientName = "MVC Client",
                //     AllowedGrantTypes = GrantTypes.Implicit,

                //     // where to redirect to after login
                //     RedirectUris = { "http://localhost:5000/signin-oidc" },

                //     // where to redirect to after logout
                //     PostLogoutRedirectUris = { "http://localhost:5000" },

                //     AllowedScopes = new List<string>
                //     {
                //         IdentityServerConstants.StandardScopes.OpenId,
                //         IdentityServerConstants.StandardScopes.Profile
                //     }
                // }
                
            };
        }

    }
}
