using IdentityServer4.Models;
using IdSvrHost.Models;

namespace IdSvrHost.Services
{
    public interface IUserRepository
    {
        User GetUserByUsername(string username);
        User GetUserById(string id);
        bool ValidatePassword(string username, string plainTextPassword);
    }
}
