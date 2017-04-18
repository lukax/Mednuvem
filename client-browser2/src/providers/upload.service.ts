import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs/Rx';
import {LoginService} from './login.service';

@Injectable()
export class UploadService {
    public progressObservable: Observable<number>;
    private progress: number;
    private progressObserver: any;

    constructor (
        private loginService: LoginService
    ) {
        this.progressObservable = Observable.create(observer => {
            this.progressObserver = observer;
        }).share();
    }

    public makeFileRequest (url: string, params: string[], files: File[]): Observable<{count: number}> {
        return Observable.create((observer: Observer<string>) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i], files[i].name);
            }

            xhr.setRequestHeader('AUTHORIZATION', 'Bearer' + this.loginService.getAccessToken())
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);

                this.progressObserver.next(this.progress);
            };

            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }
}
