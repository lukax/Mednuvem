using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;
using server;

namespace Server.Core.Models
{    
    [BsonIgnoreExtraElementsAttribute]
    public class CalendarEvent : ITeamEntity
    {
        public string Id { get; set; }
        public string TeamId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [Required] 
        public DateTime Start { get; set; }
        
        [Required] 
        public DateTime End { get; set; }

        [Required]
        public string PatientId { get; set; }

        [Required]
        public string Title { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public EventColor Color { get; set; }

    }

    public class EventColor 
    {
        public string Primary { get; set; }
        public string Secondary { get; set; }
    }
}