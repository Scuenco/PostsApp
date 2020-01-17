import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

export const mimeType = (
  control: AbstractControl
  ): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  const file = control.value as File;
  const fileReader = new FileReader();

  // Create our own Observable
  const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
    });
    // Read as array buffer to access the mime type
    fileReader.readAsArrayBuffer(file);
  });
};
