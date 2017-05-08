import { CalendarEvent } from 'angular-calendar';
import { startOfDay, addHours } from 'date-fns';

export class Team {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  name: string;
  members: TeamMember[] = [];
  messages: TeamChatMessage[] = [];
}

export class TeamMember {
  userId: string;
  role: string;
  name: string;
  email: string;
  isOnline: boolean;
}

export class TeamChatMessage {
  sentAt: Date;
  userId: string;
  email: string;
  message: string;
  userName: string;
  userEmail: string;
}

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

export class PatientCalendarEvent {
  color: EventColor;
  actions?: EventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: { beforeStart?: boolean; afterEnd?: boolean; };
  draggable?: boolean;

  id?: string;
  start: string = startOfDay(new Date()).toISOString();
  end?: string = addHours(startOfDay(new Date()), 1).toISOString();
  title: string;
  type?: string = 'Consulta';
  description?: string;
  status?: string;
}

export interface EventColor {
  primary: string;
  secondary: string;
}
export interface EventAction {
  label: string;
  cssClass?: string;
  onClick({event}: {
    event: PatientCalendarEvent;
  }): any;
}
export interface CalendarEventTimesChangedEvent {
  event: PatientCalendarEvent;
  newStart: string;
  newEnd?: string;
}
