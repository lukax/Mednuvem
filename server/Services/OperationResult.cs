using System;
namespace server.Services
{

	public abstract class OperationResult
	{
		public bool IsError { get; }
		public string Message { get; }

		public OperationResult(bool isError, string message)
		{
			IsError = isError;
			Message = message;
		}
	}

	public class SuccessOperationResult : OperationResult
	{
		public SuccessOperationResult(string message = "Ação concluída com sucesso.") : base(false, message)
		{
		}
	}

	public class FailOperationResult : OperationResult
	{
		public FailOperationResult(string message = "Não foi possível completar ação.") : base(true, message)
		{
		}
	}

}
