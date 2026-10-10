import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../../data/content';

/**
 * Los trabajos para clientes. Mientras `PROJECTS` esté vacía, enseña tres
 * huecos reservados en vez de inventar casos.
 */
@Component({
  selector: 'mw-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  /** En la propia página de proyectos, el enlace a ella sobra. */
  readonly showLink = input(true);
  protected readonly projects = PROJECTS;
  protected readonly placeholders = [$localize`Primer caso`, $localize`Segundo caso`, $localize`Tercer caso`];
}
