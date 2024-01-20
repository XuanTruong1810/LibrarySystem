# FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
# WORKDIR /app
# EXPOSE 80
# FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
# WORKDIR /src
# COPY ["ShopLaptop.csproj", "."]
# RUN dotnet restore "./ShopLaptop.csproj"
# COPY . .
# WORKDIR "/src/."
# RUN dotnet build "ShopLaptop.csproj" -c Release -o /app/build

# FROM build AS publish
# RUN dotnet publish "ShopLaptop.csproj" -c Release -o /app/publish /p:UseAppHost=false

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "ShopLaptop.dll"]





FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5076

ENV ASPNETCORE_URLS=http://+:5076

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ShopLaptop.csproj", "."]
RUN dotnet restore "./ShopLaptop.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "ShopLaptop.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ShopLaptop.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ShopLaptop.dll"]