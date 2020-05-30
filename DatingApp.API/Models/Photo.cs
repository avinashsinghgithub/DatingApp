using System;

namespace DatingApp.API.Models
{
    public class Photo
    {
        public int id{get; set;}
        public string Url {get;set;}
        public string Description { get;set;}
        public DateTime DataAdded{get; set;}
        public bool IsMain{get; set;}
        public User user{get;set;}
        public int UserId{get;set;}

    }
}