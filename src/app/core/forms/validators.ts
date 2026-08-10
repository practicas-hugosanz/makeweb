import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

/**
 * Validadores que miden sobre el texto recortado.
 *
 * Los de serie miden sobre el valor crudo, y eso abre dos huecos que se
 * comprobaron con datos reales antes de escribir esto:
 *
 * - `required` + `minLength(2)` dan por bueno `"  "`: dos espacios no están
 *   vacíos y miden dos. El lead llegaba con el nombre en blanco, porque la
 *   limpieza del envío recorta justo después.
 * - `Validators.email` da por bueno `hugo@gmail` y `a@b`, sin extensión. Es el
 *   error de tecleo más común que hay y deja un contacto al que no se puede
 *   responder.
 */

/** El valor del campo, recortado. Vacío si no es texto. */
function trimmed(control: AbstractControl): string {
  return typeof control.value === 'string' ? control.value.trim() : '';
}

/**
 * Longitud mínima medida sobre el texto recortado.
 *
 * Deja pasar el campo vacío a propósito: de eso se ocupa `required`, y si no
 * saltarían dos errores a la vez por el mismo motivo.
 */
export function minTrimmed(min: number): ValidatorFn {
  return (control): ValidationErrors | null => {
    const text = trimmed(control);
    if (!text) return null;
    return text.length >= min ? null : { minlength: { requiredLength: min, actualLength: text.length } };
  };
}

/** Que haya algo más que espacios. */
export const notBlank: ValidatorFn = (control): ValidationErrors | null =>
  control.value && !trimmed(control) ? { required: true } : null;

/** El dominio necesita punto y una extensión de dos letras como mínimo. */
const DOMAIN_WITH_TLD = /@[^\s@]+\.[a-z]{2,}$/i;

/**
 * Correo, con dos diferencias respecto a `Validators.email`: tolera espacios
 * alrededor —pegar desde el portapapeles los arrastra— y exige extensión.
 *
 * Reutiliza el validador de Angular en vez de copiar su expresión regular, que
 * cambia entre versiones. Solo lee `value`, así que se le puede pasar el texto
 * ya recortado envuelto en un objeto.
 */
export const emailFormat: ValidatorFn = (control): ValidationErrors | null => {
  const text = trimmed(control);
  if (!text) return null;

  const base = Validators.email({ value: text } as AbstractControl);
  if (base) return base;

  return DOMAIN_WITH_TLD.test(text) ? null : { email: true };
};
