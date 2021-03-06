﻿using System.Text;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using DatingApp.API.Helpers;
using AutoMapper;

namespace DatingApp.API
{
    public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<DataContext>(x =>x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
        services.AddControllers().AddNewtonsoftJson(
            opt => {
                opt.SerializerSettings.ReferenceLoopHandling= Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            }
        );
        services.AddCors();
        services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
        services.AddAutoMapper(typeof(DatingRepository).Assembly);
        services.AddScoped<IAuthRepository,AuthRepository>();
        services.AddScoped<IDatingRepository,DatingRepository>();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>{
            options.TokenValidationParameters = new TokenValidationParameters{
                ValidateIssuerSigningKey =true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.
                GetBytes(Configuration.GetSection("Appsettings:Token").Value)),
                ValidateIssuer = false,
                ValidateAudience= false
            };
        });
        services.AddScoped<LogUserActivity>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler(builder => { 
                builder.Run( async context => {
                    context.Response.StatusCode = (int)System.Net.HttpStatusCode.InternalServerError;
                    var error = context.Features.Get<IExceptionHandlerFeature>();
                    if(error !=null){
                        context.Response.AddApplicationError(error.Error.Message);
                        await context.Response.WriteAsync(error.Error.Message);
                    }
                } );
            });
            app.UseHsts();
        }

        //app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();
        app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
}
