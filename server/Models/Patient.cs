using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;
using server;

namespace Server.Core.Models
{
    [BsonIgnoreExtraElementsAttribute]
    public class Patient : BasicPerson, ITeamEntity
    {
        public string Id { get; set; }
        public string TeamId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public string MedicalInsurance { get; set; }

        public BasicPerson AccountablePerson { get; set; } = new BasicPerson();
        public BasicPerson Mother { get; set; } = new BasicPerson();
        public BasicPerson Father { get; set; } = new BasicPerson();

        public List<SocialProfile> SocialProfiles { get; set; } = new List<SocialProfile>();
        public List<MedicalReceipt> MedicalReceipts { get; set; } = new List<MedicalReceipt>();
        public string MedicalObservations { get; set; }
        
        public AppointmentInfo AppointmentInfo { get; set; } = new AppointmentInfo();
        public string Status { get; set; }

        [DisplayFormat(DataFormatString = "yyyy-MM-ddThh:mm")]
        public DateTime LastVisit { get; set; }

        public string Gender { get; set; }
        public Address Address { get; set; } = new Address();
        public Address CommercialAddress { get; set; } = new Address();

        [DisplayFormat(DataFormatString = "yyyy-MM-dd")]
        public DateTime BirthDate { get; set; }

        public string MaritalStatus { get; set; }
        public string Spouse { get; set; }
        public string Notes { get; set; }

    }

    public class MedicalReceipt 
    {
        [DisplayFormat(DataFormatString = "yyyy-MM-ddThh:mm")]
        public DateTime CreatedAt { get; set; }

        public string Type { get; set; }
        public string Description { get; set; }
    }

    public class AppointmentInfo 
    {
        public List<DescriptionInfo> Motivations { get; set; } = new List<DescriptionInfo>();
        public List<DescriptionInfo> Indications { get; set; } = new List<DescriptionInfo>();
        public List<AppointmentVisit> Visits { get; set; } = new List<AppointmentVisit>();
    }

    public class AppointmentVisit 
    {
        [DisplayFormat(DataFormatString = "yyyy-MM-ddThh:mm")]
        public DateTime CreatedAt { get; set; }

        [DisplayFormat(DataFormatString = "yyyy-MM-ddThh:mm")]
        public DateTime VisitDate { get; set; }

        public string Status { get; set; }
        public string Description { get; set; }
    }

    public class BasicPerson 
    {
        public string Name { get; set; }
        public string TaxIdNumber { get; set; }
        public string RegistrationNumber { get; set; }
        public string Email { get; set; }        
        public string JobTitle { get; set; }
        public List<PhoneNumber> PhoneNumbers { get; set; } = new List<PhoneNumber>();

        [BsonIgnore]
        public string EmailHash => MD5Util.CreateMD5(Email);
    }

    public class Address 
    {
        public string Type { get; set; }
        public string PostalCode { get; set; }
        public string Street { get; set; }
        public string StreetComplement { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Neighbourhood { get; set; }
    }

    public class PhoneNumber 
    {
        public string Type { get; set; }
        public string Number { get; set; }
    }

    public class SocialProfile 
    {
        public string Type { get; set; }
        public string Description { get; set; }
    }

    public class DescriptionInfo 
    {
        public string Type { get; set; }
        public string Description { get; set; }
    }

    public class PatientListViewModel 
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string TaxIdNumber { get; set; }
        public string MedicalInsurance { get; set; }
        public DateTime LastVisit { get; set; }
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
                AccountablePerson = new BasicPerson { Name = this.AccountablePerson },
                BirthDate = birthDateOk ? birthDate : default(DateTime),
                LastVisit  = lastAppointmentOk ? lastAppointment : default(DateTime),
                PhoneNumbers = new List<PhoneNumber> { new PhoneNumber { Type = "Contato", Number = this.PhoneNumber } },
                Address = new Address { Street = this.Address }
            };
        }
    }
    
}