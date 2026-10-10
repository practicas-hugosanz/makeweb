import { Injectable, signal } from '@angular/core';

/** Abre y cierra el contacto rápido desde cualquier sitio (hoy, la M de neón). */
@Injectable({ providedIn: 'root' })
export class QuickContactService {
  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
