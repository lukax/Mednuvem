using System;
using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Server.Core.Models;

namespace server.Models
{
    public class Team
    {
        public string Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
		public string Name { get; set; }

        public List<TeamMember> Members { get; set; } = new List<TeamMember>();
    }

    public class TeamMember 
    {
        public string UserId { get; set; }
        public string Role { get; set; }
    }
}
