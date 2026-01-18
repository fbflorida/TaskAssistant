using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using TaskAssistantAPI.Models;
using TaskAssistantAPI.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson();
;
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<TaskAssistantDbContext>(options =>
   options.UseNpgsql(builder.Configuration.GetConnectionString("TaskAssistantDbContext")));


builder.Services.AddIdentityCore<ApplicationUser>()
    .AddEntityFrameworkStores<TaskAssistantDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddIdentityApiEndpoints<ApplicationUser>();

// Add CORS services and define the policy
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowedOriginsPolicy",
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200") // Replace with your client's URL
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                          //.AllowCredentials(); // Use with caution; cannot be used with AllowAnyOrigin()
                      });
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapGroup("identity").MapIdentityApi<ApplicationUser>();

app.UseCors("AllowedOriginsPolicy");

app.Run();
