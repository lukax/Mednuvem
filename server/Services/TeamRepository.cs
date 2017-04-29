using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using server.Services;
using Server.Core.Models;
using server.Models;

namespace IdSvrHost.Services
{
    public class PagedListResult<T>
    {
        public IEnumerable<T> Result { get; set; }
        public long TotalCount { get; set; }
        public long TotalPages { get; set; }
    }

    public abstract class TeamRepository<T> where T : ITeamEntity 
    {
        private readonly string _collectionName;
        private readonly IMongoDatabase _db;
        private static bool _indexKeysCreated = false;
        protected FilterDefinitionBuilder<T> Filter => Builders<T>.Filter;
        protected SortDefinitionBuilder<T> Sort => Builders<T>.Sort;
        protected ProjectionDefinitionBuilder<T> Projection => Builders<T>.Projection;
        protected IMongoCollection<T> Collection => _db.GetCollection<T>(_collectionName);

        public TeamRepository(IOptions<MongoDbRepositoryConfiguration> config, string collectionName)
        {
            this._collectionName = collectionName;
            var client = new MongoClient(config.Value.ConnectionString);
            _db = client.GetDatabase(config.Value.DatabaseName);

            Task.Run(() => CreateIndexes());
        }


		private async Task CreateIndexes()
        {
            if (_indexKeysCreated) return;
            _indexKeysCreated = true;

			await Collection.Indexes.CreateOneAsync(Builders<T>.IndexKeys.Combine(Builders<T>.IndexKeys.Ascending(x => x.TeamId), Builders<T>.IndexKeys.Ascending(x => x.Id)));
        }
        
        public async Task<long> Count(string teamId) 
        {
		    var filter = Filter.Eq(u => u.TeamId, teamId);
            return await Collection.CountAsync(filter);
        }

        public async Task<T> FindOne(string teamId, string patientId)
        {
			var filter = Filter.And(
                Filter.Eq(u => u.TeamId, teamId),
                Filter.Eq(u => u.Id, patientId)
            );
            return await Collection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<OperationResult> DeleteOne(string teamId, string id)
        {
			var filter = Filter.And(
                Filter.Eq(u => u.TeamId, teamId),
                Filter.Eq(u => u.Id, id)
            );
            var res = await Collection.DeleteOneAsync(filter);
            if(res.DeletedCount > 0){
                return new SuccessOperationResult();
            }
            return new FailOperationResult("Nenhum paciente encontrado");
        }

        public async Task<OperationResult> InsertMany(string teamId, List<T> entityList)
		{
			entityList.ForEach(x => x.TeamId = teamId);
            await Collection.InsertManyAsync(entityList);
            return new SuccessOperationResult();
        }

		public async Task<OperationResult> InsertOne(string teamId, T entity)
		{
            entity.TeamId = teamId;
			var filter = Filter.Or(
				Filter.And(
					Filter.Eq(u => u.TeamId, teamId),
					Filter.Eq(u => u.Id, entity.Id)
				));
			if (await Collection.CountAsync(filter) > 0)
			{
				return new FailOperationResult("Já existe um paciente com essas informações.");
			}
			else
			{
				await Collection.InsertOneAsync(entity);
				return new SuccessOperationResult();
			}
		}

        public async Task<OperationResult> UpdateOne(string teamId, T entity)
        {
            entity.TeamId = teamId;
			var filter = Filter.And(
                    Filter.Eq(u => u.TeamId, teamId),
                    Filter.Eq(u => u.Id, entity.Id)
                );
            if(await Collection.CountAsync(filter) == 0)
            {
                return new FailOperationResult("Nenhum paciente encontrado.");
            }
            else
            {
                var result = await Collection.ReplaceOneAsync(filter, entity);
                return result.ModifiedCount > 0 ? new SuccessOperationResult() as OperationResult : new FailOperationResult("Nenhuma modificação") as OperationResult;
            }
        }

    }
}