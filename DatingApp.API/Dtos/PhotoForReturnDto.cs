using System;

namespace DatingApp.API.Dtos
{
    public class PhotoForReturnDto
    {
        public int id{get; set;}
        public string Url {get;set;}
        public string Description { get;set;}
        public DateTime DataAdded{get; set;}
        public bool IsMain{get; set;}
    }
}