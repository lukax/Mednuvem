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
    public class TeamRepository
    {
        private readonly string _collectionName = "Teams";
        private readonly IMongoDatabase _db;
        protected IMongoCollection<Team> Collection => _db.GetCollection<Team>(_collectionName);
        protected FilterDefinitionBuilder<Team> Filter => Builders<Team>.Filter;

        public TeamRepository(IOptions<MongoDbRepositoryConfiguration> config)
        {
            var client = new MongoClient(config.Value.ConnectionString);
            _db = client.GetDatabase(config.Value.DatabaseName);
        }

        public async Task<Team> FindOneById(string entityId)
        {
			var filter = Filter.Eq(u => u.Id, entityId);
            return await Collection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<Team> FindOneByUserIdAsync(string userId)
        {
            return await Collection.Find(x => x.Members.Any(m => m.UserId == userId)).FirstOrDefaultAsync();
        }

        public async Task<TeamChatMessage> AddMessageToTeam(string userId, string message)
        {
            var chatMessage = new TeamChatMessage
            {
                UserId = userId,
                Message = message,
                SentAt = DateTime.UtcNow,
            };
            var result = await Collection.UpdateOneAsync(x => x.Members.Any(m => m.UserId == userId),
                Builders<Team>.Update.AddToSet(x => x.Messages, chatMessage));
            return chatMessage;
        }

		public async Task<OperationResult> InsertOne(Team entity)
		{
			var filter = Filter.Eq(u => u.Id, entity.Id);
			if (await Collection.CountAsync(filter) > 0)
			{
				return new FailOperationResult("Já existe uma equipe com essas informações.");
			}
			else
			{
				await Collection.InsertOneAsync(entity);
				return new SuccessOperationResult();
			}
		}

        public async Task<OperationResult> UpdateOne(Team entity)
        {
			var filter = Filter.Eq(u => u.Id, entity.Id);
            if(await Collection.CountAsync(filter) == 0)
            {
                return new FailOperationResult("Nenhuma equipe encontrada.");
            }
            else
            {
                var result = await Collection.ReplaceOneAsync(filter, entity);
                return result.ModifiedCount > 0 ? new SuccessOperationResult() as OperationResult : new FailOperationResult("Nenhuma modificação") as OperationResult;
            }
        }
        
        public async Task<OperationResult> DeleteOne(string entityId)
        {
			var filter = Filter.Eq(u => u.Id, entityId);
            var res = await Collection.DeleteOneAsync(filter);
            if(res.DeletedCount > 0){
                return new SuccessOperationResult();
            }
            return new FailOperationResult("Nenhum registro encontrado");
        }

    }
}