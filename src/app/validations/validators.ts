import {AbstractControl, ValidationErrors} from '@angular/forms';
export function dateNotFuture(): ValidationErrors | null {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    const fecha = new Date(control.value);
    const fechaHoy = new Date();
    fechaHoy.setHours(0,0,0,0);
    return fecha <= fechaHoy ? null : {fechaFutura: true}
  }
}
