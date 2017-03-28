using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Server.Core.Models;

namespace IdSvrHost.Services
{
    public class PagedListResult<T>
    {
        public IEnumerable<T> Result { get; set; }
        public long TotalCount { get; set; }
        public long TotalPages { get; set; }
    }

    public class PatientRepository 
    {
        private const string PatientsCollectionName = "Patients";
        private readonly IMongoDatabase _db;
        private FilterDefinitionBuilder<Patient> FilterBuilder => Builders<Patient>.Filter;
        private SortDefinitionBuilder<Patient> SortBuilder => Builders<Patient>.Sort;
        private IMongoCollection<Patient> Collection => _db.GetCollection<Patient>(PatientsCollectionName);
            
        public PatientRepository(IOptions<MongoDbRepositoryConfiguration> config)
        {
            var client = new MongoClient(config.Value.ConnectionString);
            _db = client.GetDatabase(config.Value.DatabaseName);
        }

        public async Task<PagedListResult<Patient>> GetAll(string userId, int pageSize = 50, int pageNumber = 1, string orderBy = "", string search = "")
        {
            var totalCount = await this.Count(userId); 
            var totalPages = (long) Math.Ceiling((double)totalCount / pageSize); 

            var filter = FilterBuilder.Eq(u => u.UserId, userId);
            if(!string.IsNullOrWhiteSpace(search)){
                filter = FilterBuilder.And(filter, 
                    FilterBuilder.Text(search, new TextSearchOptions{CaseSensitive = false, DiacriticSensitive = false}));
            }
            var sort = SortBuilder.Descending(x => x.LastAppointment);
            if(!string.IsNullOrWhiteSpace(orderBy)){
                sort = SortBuilder.Ascending(orderBy);
            }
            return new PagedListResult<Patient> {
                TotalCount = totalCount,
                TotalPages = totalPages,
                Result = await Collection.Find(filter)
                    .Skip((pageNumber - 1) * pageSize)
                    .Limit(pageSize)
                    .Sort(sort)
                    .ToListAsync()
            };
        }

        public async Task<long> Count(string userId) 
        {
            var filter = FilterBuilder.Eq(u => u.UserId, userId);
            return await Collection.CountAsync(filter);
        }

        public async Task<IList<Patient>> FindOne(string userId, string patientId)
        {
            var filter = FilterBuilder.And(
                FilterBuilder.Eq(u => u.UserId, userId),
                FilterBuilder.Eq(u => u.Id, patientId)
            );
            return await Collection.Find(filter).ToListAsync();
        }

        public async Task InsertOne(Patient patient){
            await Collection.InsertOneAsync(patient);
        }


    }
}