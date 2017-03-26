using System;
using System.Threading.Tasks;
using IdSvrHost.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace IdSvrHost.Services
{
    public class MongoDbRepository : IRepository
    {
        private readonly IPasswordHasher<MongoDbUser> _passwordHasher;
        private readonly IMongoDatabase _db;
        private const string UsersCollectionName = "Users";
        private const string ClientsCollectionName = "Clients";
        

        public MongoDbRepository(IOptions<MongoDbRepositoryConfiguration> config, IPasswordHasher<MongoDbUser> passwordHasher)
        {
            _passwordHasher = passwordHasher;
            var client = new MongoClient(config.Value.ConnectionString);
            _db = client.GetDatabase(config.Value.DatabaseName);
        }

        public MongoDbUser GetUserByUsername(string username)
        {
            var collection = _db.GetCollection<MongoDbUser>(UsersCollectionName);
            var filter = Builders<MongoDbUser>.Filter.Eq(u => u.Username, username);
            return collection.Find(filter).SingleOrDefaultAsync().Result;
        }

        public async Task CreateUser(MongoDbUser user, string plainTextPassword){
            user.Id = Guid.NewGuid().ToString();
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            user.HashedPassword = _passwordHasher.HashPassword(user, plainTextPassword);
            await _db.GetCollection<MongoDbUser>(UsersCollectionName).InsertOneAsync(user);
        }

        public MongoDbUser GetUserById(string id)
        {
            var collection = _db.GetCollection<MongoDbUser>(UsersCollectionName);
            var filter = Builders<MongoDbUser>.Filter.Eq(u => u.Id, id);
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
