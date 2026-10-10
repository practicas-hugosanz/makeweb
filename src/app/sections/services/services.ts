import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICES } from '../../data/content';
import { pageForService } from '../../data/services';
import { ServiceArt, ServiceArtKind } from '../service-art/service-art';

/**
 * Lo que hacemos, sobre papel: una tarjeta por servicio con su número, su
 * nombre, su ilustración y, al lado, qué incluye y qué va con cuota. Cada tarjeta
 * lleva a la página del servicio.
 */
@Component({
  selector: 'mw-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ServiceArt],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  protected readonly services = SERVICES;
  protected readonly pageFor = pageForService;

  protected artFor(id: string): ServiceArtKind {
    return id as ServiceArtKind;
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
