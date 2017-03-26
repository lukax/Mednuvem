using System;
using System.Linq;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace IdSvrHost.Models
{
    public class MongoDbUser
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string FirstName => Name?.Split(' ')[0];
        public string LastName => Name?.Split(' ').Skip(1).Aggregate("", (a, s) => a + ' ' + s);
        public string Email { get; set; }
        public bool EmailVerified { get; set; }
        public bool IsActive { get; set; }
        public string HashedPassword { get; set; }
        public string Company { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }


        [BsonExtraElements]
        public BsonDocument ExtraElements { get; set; }
    }
}
