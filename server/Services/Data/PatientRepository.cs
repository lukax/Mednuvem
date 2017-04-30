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
    public class PatientRepository : BaseRepository<Patient>
    {

        public PatientRepository(IOptions<MongoDbRepositoryConfiguration> config)
            :base(config, "Patients")
        {
        }

        public async Task<PagedListResult<PatientListViewModel>> GetAll(
            string teamId, int pageSize = 50, int pageNumber = 1, string orderBy = "", string search = "")
        {
            var totalCount = await this.Count(teamId); 
            var totalPages = (long) Math.Ceiling((double)totalCount / pageSize); 

            var filter = Filter.Eq(u => u.TeamId, teamId);
            if(!string.IsNullOrWhiteSpace(search)){
                filter = Filter.And(filter, 
                    Filter.Regex(u => u.Name, new BsonRegularExpression($@"/{search}/i")));
            }
            var sort = Sort.Descending(x => x.LastVisit);
            if(!string.IsNullOrWhiteSpace(orderBy)){
                sort = Sort.Ascending(orderBy);
            }
            ProjectionDefinition<Patient, PatientListViewModel> projection = Projection
                                            .Include(x => x.Id)
                                            .Include(x => x.Name)
                                            .Include(x => x.Email)
                                            .Include(x => x.TaxIdNumber)
                                            .Include(x => x.MedicalInsurance)
                                            .Include(x => x.LastVisit);
            return new PagedListResult<PatientListViewModel> {
                TotalCount = totalCount,
                TotalPages = totalPages,
                Result = await Collection
                    .Find(filter)
                    .Skip((pageNumber - 1) * pageSize)
                    .Limit(pageSize)
                    .Project(projection)
                    .Sort(sort)
                    .ToListAsync()
            };
        }



    }
}