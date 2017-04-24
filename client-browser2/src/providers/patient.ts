

export class BasicPerson {
    name: string;
    taxIdNumber: string;
    registrationNumber: string;
    email: string;
    emailHash: string;
    jobTitle: string;
    phoneNumbers: PhoneNumber[] = [];
}

export class Patient extends BasicPerson {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  birthDate: Date;
  gender: string;
  medicalInsurance: string;
  accountablePerson: BasicPerson = new BasicPerson();
  mother: BasicPerson = new BasicPerson();
  father: BasicPerson = new BasicPerson();
  socialProfiles: SocialProfile[] = [];
  medicalReceipts: MedicalReceipt[] = [];
  medicalObservations: string;

  status: string;
  lastVisit: Date;
  appointmentInfo: AppointmentInfo = new AppointmentInfo();

  address: Address = new Address();
  commercialAddress: Address = new Address();
  maritalStatus: string;
  spouse: string;
  notes: string;
}

export class Address {
	type: string;
	postalCode: string;
	street: string;
	streetComplement: string;
	city: string;
	state: string;
	country: string;
	neighbourhood: string;
}

export class PhoneNumber {
	type: string;
	number: string;
}

export class SocialProfile {
    type: string;
    description: string;
}

export class MedicalReceipt {
    type: string;
    description: string;
}

export class AppointmentInfo {
    motivations: DescriptionInfo[] = [];
    indications: DescriptionInfo[] = [];
    visits: AppointmentVisit[] = [];
}

export class DescriptionInfo {
    type: string;
    description: string;
}

export class AppointmentVisit {
    createdAt: Date;
    visitDate: Date;
    status: string;
    description: string;
}
