
using System;
using Newtonsoft.Json;
using server;

namespace Server.Core.Models
{
    public class Patient 
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string TaxIdNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string MedicalInsurance { get; set; }
        public string PhoneNumber { get; set; }
        public string AccountablePerson { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTime? LastAppointment { get; set; }
        public string Observations { get; set; }
        public string MedicalReceipt { get; set; }
    }

    public class PatientViewModel
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string TaxIdNumber { get; set; }
        public string MedicalInsurance { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string AccountablePerson { get; set; }
        public string BirthDate { get; set; }
        public string LastAppointment { get; set; }
        public string Observations { get; set; }
        public string MedicalReceipt { get; set; }

        public Patient ToPatient(string patientId = null) {
            DateTime birthDate;
            var birthDateOk = DateTime.TryParse(this.BirthDate, out birthDate);
            DateTime lastAppointment;
            var lastAppointmentOk = DateTime.TryParse(this.LastAppointment, out lastAppointment);
            return new Patient {
                    Id = patientId == null ? Guid.NewGuid().ToString() : patientId,
                    UserId = UserId,
                    AccountablePerson = this.AccountablePerson,
                    Address = this.Address,
                    BirthDate = birthDateOk ? birthDate : default(DateTime?),
                    LastAppointment = lastAppointmentOk ? lastAppointment : default(DateTime?),
                    Name = this.Name,
                    PhoneNumber = this.PhoneNumber,
                    Email = this.Email,
                    MedicalInsurance = this.MedicalInsurance,
                    Observations = this.Observations,
                    MedicalReceipt = this.MedicalReceipt
                };
        }
    }

    
}