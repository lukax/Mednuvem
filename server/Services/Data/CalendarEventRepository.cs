using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using server.Services;
using Server.Core.Models;

namespace IdSvrHost.Services
{
    public class CalendarEventRepository : BaseRepository<CalendarEvent>
    {

        public CalendarEventRepository(IOptions<MongoDbRepositoryConfiguration> config)
            :base(config, "CalendarEvents")
        {
        }
        
        public async Task<PagedListResult<CalendarEvent>> GetAll(
            string teamId, int pageSize = 50, int pageNumber = 1, string orderBy = "", string search = "")
        {
            var totalCount = await this.Count(teamId); 
            var totalPages = (long) Math.Ceiling((double)totalCount / pageSize);

			var filter = Filter.Eq(u => u.TeamId, teamId);
            if(!string.IsNullOrWhiteSpace(search)){
                filter = Filter.And(filter, 
                    Filter.Regex(u => u.Description, new BsonRegularExpression($@"/{search}/i")));
            }
            var sort = Sort.Descending(x => x.CreatedAt);
            if(!string.IsNullOrWhiteSpace(orderBy)){
                sort = Sort.Ascending(orderBy);
            }
            return new PagedListResult<CalendarEvent> {
                TotalCount = totalCount,
                TotalPages = totalPages,
                Result = await Collection
                    .Find(filter)
                    .Skip((pageNumber - 1) * pageSize)
                    .Limit(pageSize)
                    .Sort(sort)
                    .ToListAsync()
            };
        }


    }
}