import {AutoCompleteService} from 'ionic2-auto-complete';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import {PatientService} from "./patient.service";

@Injectable()
export class PatientAutoCompleteService implements AutoCompleteService {
  labelAttribute = "name";

  constructor(public patientSvc: PatientService) {

  }

  getResults(keyword:string) {
    return this.patientSvc.search(keyword, 1, 10)
      .map(data => data.result);
  }

}
