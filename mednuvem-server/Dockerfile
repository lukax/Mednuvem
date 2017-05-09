FROM microsoft/dotnet:1.0.1-core
WORKDIR /app
ENV ASPNETCORE_URLS http://*:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "mednuvem-server.dll"]
COPY . /app
