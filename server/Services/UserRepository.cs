using System;
using System.Threading.Tasks;
using IdSvrHost.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using server.Models;

namespace IdSvrHost.Services
{
    public class UserRepository : IUserRepository
    {
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IMongoDatabase _db;
        private const string UsersCollectionName = "Users";
        private const string ClientsCollectionName = "Clients";
        private const string TeamsCollectionName = "Teams";

        public UserRepository(IOptions<MongoDbRepositoryConfiguration> config, IPasswordHasher<User> passwordHasher)
        {
            _passwordHasher = passwordHasher;
            var client = new MongoClient(config.Value.ConnectionString);
            _db = client.GetDatabase(config.Value.DatabaseName);
        }

        public User GetUserByUsername(string username)
        {
            var collection = _db.GetCollection<User>(UsersCollectionName);
            var filter = Builders<User>.Filter.Eq(u => u.Username, username);
            return collection.Find(filter).SingleOrDefaultAsync().Result;
        }

        public async Task CreateUser(User user, string plainTextPassword){
            user.Id = Guid.NewGuid().ToString();
            user.TeamId = Guid.NewGuid().ToString();
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            user.HashedPassword = _passwordHasher.HashPassword(user, plainTextPassword);
            await _db.GetCollection<User>(UsersCollectionName).InsertOneAsync(user);
            // await _db.GetCollection<Team>(TeamsCollectionName).InsertOneAsync(new Team
            // {
            //     Id = user.TeamId,
            //     CreatedAt = DateTime.UtcNow,
            //     UpdatedAt = DateTime.UtcNow,
            //     Name = user.Company
            // });
        }

        public User GetUserById(string id)
        {
            var collection = _db.GetCollection<User>(UsersCollectionName);
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            return collection.Find(filter).SingleOrDefaultAsync().Result;
        }

        public bool ValidatePassword(string username, string plainTextPassword)
        {
            var user = GetUserByUsername(username);
            if (user == null)
            {
                return false;
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.HashedPassword, plainTextPassword);
            switch (result)
            {
                case PasswordVerificationResult.Success:
                    return true;
                case PasswordVerificationResult.Failed:
                    return false;
                case PasswordVerificationResult.SuccessRehashNeeded:
                    throw new NotImplementedException();
                default:
                    throw new NotImplementedException();
            }
        }

    }
}
