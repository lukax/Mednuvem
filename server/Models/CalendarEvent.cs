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

        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public string Title { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public EventColor Color { get; set; }

        public string PatientId { get; set; }
    }

    public class EventColor 
    {
        public string Primary { get; set; }
        public string Secondary { get; set; }
    }
}