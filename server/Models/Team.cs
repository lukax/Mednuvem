using System;
namespace server.Models
{
    public class Team
    {
        public string Id { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

		public string Name { get; set; }
    }
}
