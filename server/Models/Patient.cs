
using System;

namespace Server.Core.Models
{
    public class Patient 
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string MedicalInsurance { get; set; }
        public string PhoneNumber { get; set; }
        public string AccountablePerson { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime LastAppointment { get; set; }
    }
}