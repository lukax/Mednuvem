
using System;
using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MongoDB.Bson.Serialization.Attributes;
using server;

namespace Server.Core.Models
{
    public class Patient 
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public string Name { get; set; }

        public string TaxIdNumber { get; set; }
        public string RegistrationNumber { get; set; }
        
        public string Email { get; set; }

        [BsonIgnore]
        public string EmailHash => MD5Util.CreateMD5(Email);

        public string MedicalInsurance { get; set; }
        public string AccountablePerson { get; set; }
        public string AccountablePersonTaxIdNumber { get; set; }
        public string AccountablePersonRegistrationNumber { get; set; }


        [DisplayFormat(DataFormatString = "yyyy-MM-dd")]
        public DateTime? BirthDate { get; set; }

        [DisplayFormat(DataFormatString = "yyyy-MM-ddThh:mm")]
        public DateTime? LastAppointment { get; set; }
        
        public string Observations { get; set; }
        public string MedicalReceipt { get; set; }
        public string Gender { get; set; }
        
        public string MaritalStatus { get; set; }
        public string Spouse { get; set; }

        public string PhoneNumber { get; set; }
        public string ResidentialPhoneNumber { get; set; }
        public string CommercialPhoneNumber { get; set; }
        public string ContactPhoneNumber { get; set; }

        public string SocialMediaType { get; set; }
        public string SocialMediaAddress { get; set; }
        public string SocialMediaType2 { get; set; }
        public string SocialMediaAddress2 { get; set; }

        public string ZipCode { get; set; }
        public string Address { get; set; }
        public string AddressComplement { get; set; }
        public string Neighborhood { get; set; }

    }

    public class PatientListViewModel 
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string TaxIdNumber { get; set; }
        public string MedicalInsurance { get; set; }
        public DateTime? LastAppointment { get; set; }
        public string Email { get; set; }
        
        [BsonIgnore]
        public string EmailHash => MD5Util.CreateMD5(Email);
    }

    public class PatientImportViewModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string MedicalInsurance { get; set; }
        public string AccountablePerson { get; set; }
        public string BirthDate { get; set; }
        public string LastAppointment { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }

        public Patient ToPatient() {
            DateTime birthDate;
            DateTime lastAppointment;
            var birthDateOk = DateTime.TryParse(this.BirthDate, out birthDate);
            var lastAppointmentOk = DateTime.TryParse(this.LastAppointment, out lastAppointment);
            return new Patient {
                Name = this.Name,
                Email = this.Email,
                MedicalInsurance = this.MedicalInsurance,
                AccountablePerson = this.AccountablePerson,
                BirthDate = birthDateOk ? birthDate : default(DateTime),
                LastAppointment = lastAppointmentOk ? lastAppointment : default(DateTime),
                PhoneNumber = this.PhoneNumber,
                Address = this.Address
            };
        }
    }
    
}