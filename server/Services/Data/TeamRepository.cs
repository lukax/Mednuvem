using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using server.Models;
using server.Services;
using Server.Core.Models;

namespace IdSvrHost.Services
{
    public class TeamRepository : BaseRepository<Team>
    {

        public TeamRepository(IOptions<MongoDbRepositoryConfiguration> config)
            :base(config, "Teams")
        {
        }
        

    }
}