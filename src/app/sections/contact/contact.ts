import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { gsap } from '../../core/animation/gsap';
import { MagneticDirective } from '../../core/animation/magnetic.directive';
import { MotionService } from '../../core/animation/motion.service';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { SERVICES } from '../../data/content';
import { LeadActions } from '../../state/lead/lead.actions';
import { selectError, selectReference, selectStatus } from '../../state/lead/lead.feature';
import { BUDGETS } from '../../state/lead/lead.model';

@Component({
  selector: 'mw-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    RouterLink,
    RevealDirective,
    MagneticDirective,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly motion = inject(MotionService);

  protected readonly services = SERVICES;
  protected readonly budgets = BUDGETS;

  protected readonly status = this.store.selectSignal(selectStatus);
  protected readonly reference = this.store.selectSignal(selectReference);
  protected readonly error = this.store.selectSignal(selectError);
  protected readonly sending = computed(() => this.status() === 'sending');
  protected readonly sent = computed(() => this.status() === 'sent');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    business: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^[+0-9 ()-]{9,20}$/)]],
    service: [SERVICES[0].id, Validators.required],
    budget: [BUDGETS[1].id, Validators.required],
    message: ['', [Validators.required, Validators.minLength(12)]],
    consent: [false, Validators.requiredTrue],
  });

  constructor() {
    afterNextRender(() => this.form.controls.phone.markAsUntouched());

    // The success panel is a state transition, so it gets an animation that
    // reads as one: the form leaves, the confirmation takes its place.
    effect(() => {
      if (!this.sent() || this.motion.reducedMotion()) return;
      queueMicrotask(() => {
        const panel = this.root().nativeElement.querySelector('[data-done]');
        if (panel) {
          gsap.from(panel, { y: 24, opacity: 0, duration: 0.9, ease: 'mw-out' });
        }
      });
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.shake();
      return;
    }
    this.store.dispatch(LeadActions.submitted({ lead: this.form.getRawValue() }));
  }

  protected reset(): void {
    this.store.dispatch(LeadActions.reset());
    this.form.reset({ service: SERVICES[0].id, budget: BUDGETS[1].id, consent: false });
  }

  /** A short, physical nudge — enough to notice, not enough to punish. */
  private shake(): void {
    if (this.motion.reducedMotion()) return;
    const form = this.root().nativeElement.querySelector('[data-form]');
    gsap.fromTo(
      form,
      { x: -7 },
      { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.35)', overwrite: true },
    );
  }
}
