import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { UserService } from '../services/user/user-service';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';

export function dateNotFuture(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const fecha = new Date(control.value);
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);
    return fecha <= fechaHoy ? null : { fechaFutura: true };
  };
}

export function emailExists(
  userService: UserService,
  currentUserEmail?: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    // Si estamos editando y el email es el mismo que el actual, no validar
    if (currentUserEmail && control.value === currentUserEmail) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((email) =>
        userService.existeEmail(email).pipe(
          map((exists) => {
            console.log('Email exists:', exists);
            return exists ? { emailExists: true } : null;
          }),
          catchError(() => of(null))
        )
      )
    );
  };
}

export function dniExists(
  userService: UserService,
  currentUserDni?: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    // Si estamos editando y el DNI es el mismo que el actual, no validar
    if (currentUserDni && control.value === currentUserDni) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((dni) =>
        userService.existeDni(dni).pipe(
          map((exists) => {
            console.log('DNI exists:', exists);
            return exists ? { dniExists: true } : null;
          }),
          catchError(() => of(null))
        )
      )
    );
  };
}
