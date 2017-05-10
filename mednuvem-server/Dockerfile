FROM microsoft/dotnet:1.1-runtime
WORKDIR /app
ENV ASPNETCORE_URLS http://*:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "mednuvem-server.dll"]
COPY . /app
