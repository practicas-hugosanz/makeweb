import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** El cierre de la portada: una frase y el botón de presupuesto. */
@Component({
  selector: 'mw-closing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './closing.html',
  styleUrl: './closing.scss',
})
export class Closing {}
