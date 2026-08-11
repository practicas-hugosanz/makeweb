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
import { LEAD_LIMITS } from '../../core/forms/sanitize';
import { emailFormat, minTrimmed, notBlank } from '../../core/forms/validators';
import { gsap } from '../../core/animation/gsap';
import { MotionService } from '../../core/animation/motion.service';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { SweepDirective } from '../../core/animation/sweep.directive';
import { PLANS } from '../../data/content';
import { PHONES } from '../../data/legal';
import { LeadActions } from '../../state/lead/lead.actions';
import { selectError, selectReference, selectStatus } from '../../state/lead/lead.feature';
import { STARTING_POINTS, UNDECIDED_PLAN } from '../../state/lead/lead.model';

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
    SweepDirective,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly motion = inject(MotionService);

  /** Los tres planes tal y como se venden, más "aún no lo sé". */
  protected readonly planOptions = [
    ...PLANS.map((plan) => ({ id: plan.id, label: `${plan.name} — ${plan.kind.toLowerCase()}` })),
    UNDECIDED_PLAN,
  ];
  protected readonly startingPoints = STARTING_POINTS;
  protected readonly phones = PHONES;

  protected readonly status = this.store.selectSignal(selectStatus);
  protected readonly reference = this.store.selectSignal(selectReference);
  protected readonly error = this.store.selectSignal(selectError);
  protected readonly sending = computed(() => this.status() === 'sending');
  protected readonly sent = computed(() => this.status() === 'sent');

  /** Los mismos topes que aplica el envío, para escribirlos una sola vez. */
  protected readonly limits = LEAD_LIMITS;

  protected readonly form = this.fb.nonNullable.group({
    name: [
      '',
      [Validators.required, notBlank, minTrimmed(2), Validators.maxLength(LEAD_LIMITS.name)],
    ],
    business: [
      '',
      [Validators.required, notBlank, Validators.maxLength(LEAD_LIMITS.business)],
    ],
    email: ['', [Validators.required, emailFormat, Validators.maxLength(LEAD_LIMITS.email)]],
    phone: ['', [Validators.pattern(/^[+0-9 ()-]{9,20}$/)]],
    plan: [UNDECIDED_PLAN.id, Validators.required],
    current: [STARTING_POINTS[0].id, Validators.required],
    message: [
      '',
      [Validators.required, notBlank, minTrimmed(12), Validators.maxLength(LEAD_LIMITS.message)],
    ],
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
    this.form.reset({ plan: UNDECIDED_PLAN.id, current: STARTING_POINTS[0].id, consent: false });
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
