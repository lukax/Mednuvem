
using System;
using System.ComponentModel.DataAnnotations;
using AutoMapper;

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
        public string MedicalInsurance { get; set; }
        public string AccountablePerson { get; set; }

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
        public string PhoneNumberOperator { get; set; }
        public string ResidentialPhoneNumberOperator { get; set; }
        public string ResidentialPhoneNumber { get; set; }

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
    }

    public class PatientDetailViewModel
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; }

        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }

        public string Name { get; set; }

        public string TaxIdNumber { get; set; }
        public string RegistrationNumber { get; set; }
        
        public string Email { get; set; }
        public string MedicalInsurance { get; set; }
        public string AccountablePerson { get; set; }

        public string BirthDate { get; set; }

        public string LastAppointment { get; set; }
        
        public string Observations { get; set; }
        public string MedicalReceipt { get; set; }
        public string Gender { get; set; }
        
        public string MaritalStatus { get; set; }
        public string Spouse { get; set; }

        public string PhoneNumber { get; set; }
        public string PhoneNumberOperator { get; set; }
        public string ResidentialPhoneNumberOperator { get; set; }
        public string ResidentialPhoneNumber { get; set; }

        public string SocialMediaType { get; set; }
        public string SocialMediaAddress { get; set; }
        public string SocialMediaType2 { get; set; }
        public string SocialMediaAddress2 { get; set; }

        public string ZipCode { get; set; }
        public string Address { get; set; }
        public string AddressComplement { get; set; }
        public string Neighborhood { get; set; }

        public Patient ToPatient() {
            var patient = Mapper.Map<Patient>(this);
            return patient;
        }
    }
    
}