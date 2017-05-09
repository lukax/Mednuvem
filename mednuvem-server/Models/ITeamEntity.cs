using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;
using server;

namespace Server.Core.Models
{
    public interface ITeamEntity 
    {
        string Id { get; set; }
        string TeamId { get; set; }
        DateTime CreatedAt { get; set; }
        DateTime UpdatedAt { get; set; }
    }
}