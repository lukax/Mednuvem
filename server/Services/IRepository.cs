using IdentityServer4.Models;
using IdSvrHost.Models;

namespace IdSvrHost.Services
{
    public interface IRepository
    {
        MongoDbUser GetUserByUsername(string username);
        MongoDbUser GetUserById(string id);
        bool ValidatePassword(string username, string plainTextPassword);
    }
}
