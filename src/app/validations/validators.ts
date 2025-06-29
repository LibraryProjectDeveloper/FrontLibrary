import {AbstractControl, ValidationErrors,ValidatorFn} from '@angular/forms';
export function dateNotFuture(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const fecha = new Date(control.value);
    const fechaHoy = new Date();
    fechaHoy.setHours(0,0,0,0);
    return fecha <= fechaHoy ? null : {fechaFutura: true}
  }
}
