using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Server.Core.Models;

namespace IdSvrHost.Services
{
    public class PatientRepository 
    {
        private readonly IMongoDatabase _db;
        private const string MeetingsCollectionName = "Meetings";
        

        public PatientRepository(IOptions<MongoDbRepositoryConfiguration> config)
        {
            var client = new MongoClient(config.Value.ConnectionString);
            _db = client.GetDatabase(config.Value.DatabaseName);
        }

        public async Task<IList<Patient>> GetMeetings(string userId)
        {
            var collection = _db.GetCollection<Patient>(MeetingsCollectionName);
            var filter = Builders<Patient>.Filter.Eq(u => u.UserId, userId);
            return await collection.Find(filter).ToListAsync();
        }

        public async Task CreateMeeting(Patient meeting){
            await _db.GetCollection<Patient>(MeetingsCollectionName).InsertOneAsync(meeting);
        }

    }
}