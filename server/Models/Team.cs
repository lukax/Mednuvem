using System;
using MongoDB.Bson.Serialization.Attributes;
using Server.Core.Models;

namespace server.Models
{
    public class Team : ITeamEntity
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

		public string Company { get; set; }

        [BsonIgnore]
        public string TeamId => Id;
    }
}
