using System;
using System.Collections.Generic;
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

        public UserRepository(IOptions<MongoDbRepositoryConfiguration> config, IPasswordHasher<User> passwordHasher)
        {
            _passwordHasher = passwordHasher;
            var client = new MongoClient(config.Value.ConnectionString);
            _db = client.GetDatabase(config.Value.DatabaseName);
        }

        public User GetUserByUsername(string username)
        {
            username = username.ToLower();
            var collection = _db.GetCollection<User>(UsersCollectionName);
            var filter = Builders<User>.Filter.Eq(u => u.Username, username);
            return collection.Find(filter).SingleOrDefault();
        }

        public async Task CreateUser(User user, string plainTextPassword){
            user.Id = Guid.NewGuid().ToString();
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            user.HashedPassword = _passwordHasher.HashPassword(user, plainTextPassword);
            await _db.GetCollection<User>(UsersCollectionName).InsertOneAsync(user);
        }

        public User GetUserById(string id)
        {
            var collection = _db.GetCollection<User>(UsersCollectionName);
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            return collection.Find(filter).SingleOrDefault();
        }

        public async Task<List<User>> FindManyByUserIdAsync(string[] ids)
        {
            var collection = _db.GetCollection<User>(UsersCollectionName);
            var filter = Builders<User>.Filter.In(u => u.Id, ids);
            return await collection.Find(filter).ToListAsync();
        }

        public bool SetOnlineStatus(string id, bool isOnline, string sockedId)
        {
            var collection = _db.GetCollection<User>(UsersCollectionName);
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            return collection.UpdateOne(filter, 
                Builders<User>.Update.Set(x => x.IsOnline, isOnline)
                                     .Set(x => x.SocketId, sockedId)).MatchedCount > 0;
        }

        public async Task<List<User>> GetUserById(string[] id)
        {
            var collection = _db.GetCollection<User>(UsersCollectionName);
            var filter = Builders<User>.Filter.In(u => u.Id, id);
            return await collection.Find(filter).ToListAsync();
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
