import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // constructor(private injector: Injector) {}

  handleError(error: any): void {
    const errorSwal = Swal.mixin({
      icon: 'error',
      confirmButtonColor: 'var(--danger)',
    });

    if (error instanceof HttpErrorResponse) {
      errorSwal.fire({
        title: error.status + '',
        text: error.error,
      });
    } else {
      errorSwal.fire({
        title: 'An error ocurred',
        text: error,
      });
    }

    console.error(error);
  }
}
