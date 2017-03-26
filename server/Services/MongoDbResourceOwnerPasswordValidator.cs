﻿using System.Threading.Tasks;
using IdentityServer4.Validation;
using System;
using IdentityServer4.Models;

namespace IdSvrHost.Services
{
    public class MongoDbResourceOwnerPasswordValidator : IResourceOwnerPasswordValidator
    {
        private readonly IRepository _repository;

        public MongoDbResourceOwnerPasswordValidator(IRepository repository)
        {
            _repository = repository;
        }

        Task IResourceOwnerPasswordValidator.ValidateAsync(ResourceOwnerPasswordValidationContext context)
        {
            if (_repository.ValidatePassword(context.UserName, context.Password))
            {
                var user = _repository.GetUserByUsername(context.UserName);
                context.Result = new GrantValidationResult(user.Id, "password");
                return Task.FromResult(0);
            }
       
            context.Result = new GrantValidationResult(TokenRequestErrors.InvalidRequest, "Wrong username or password");
            return Task.FromResult(0);
        }
    }
}
