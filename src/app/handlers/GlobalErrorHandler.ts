import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // constructor(private injector: Injector) {}

  handleError(error: any): void {
    const errorSwal = Swal.mixin({
      icon: 'error',
      buttonsStyling: false,
      focusConfirm: true,
      customClass: {
        confirmButton: 'w-25 btn btn-danger',
      },
    });

    if (error instanceof HttpErrorResponse) {
      errorSwal.fire({
        title: `Status Code ${error.status}`,
        html: `
        <h5>${error.statusText}</h5>
        <p class="text-danger">${error.error}</p>
        `,
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
