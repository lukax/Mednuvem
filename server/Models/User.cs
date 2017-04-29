using System;
using System.Linq;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Server.Core.Models;

namespace IdSvrHost.Models
{
    public class User : ITeamEntity
    {
		public string Id { get; set; }
		public string TeamId { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }

        public string Username { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool EmailVerified { get; set; }
        public bool IsActive { get; set; }
        public string HashedPassword { get; set; }
        public string Company { get; set; }
        public string Role { get; set; }

        [BsonExtraElements]
        public BsonDocument ExtraElements { get; set; }

        public string GetFirstName() {
            return Name?.Split(' ')[0];
        }

        public string GetLastName() {
            return Name?.Split(' ').Skip(1).Aggregate("", (a, s) => a + ' ' + s);
        }
    }
}
