import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';
import { SplitText, gsap } from './gsap';
import { MotionService } from './motion.service';

/**
 * Masked line/word reveal for headlines.
 *
 * `autoSplit` re-splits when the font finishes loading or the element rewraps,
 * so the mask never ends up clipping the wrong line on resize.
 */
@Directive({
  selector: '[mwSplit]',
  host: { '[attr.data-anim]': '"split"' },
})
export class SplitTextDirective {
  /** 'lines' reads better for paragraphs, 'words' for short display headlines. */
  readonly type = input<'lines' | 'words' | 'chars'>('lines', { alias: 'mwSplit' });
  readonly splitDelay = input(0);
  readonly splitStagger = input(0.09);
  /** 'load' plays immediately; 'scroll' waits for the element and reverses on scroll up. */
  readonly splitTrigger = input<'load' | 'scroll'>('scroll');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(async () => {
      if (this.motion.reducedMotion()) {
        gsap.set(this.host, { visibility: 'visible' });
        return;
      }

      await document.fonts.ready;

      this.motion.scope(
        this.host,
        () => {
          gsap.set(this.host, { visibility: 'visible' });

          const type = this.type();
          const scroll = this.splitTrigger() === 'scroll';

          SplitText.create(this.host, {
            type,
            mask: type,
            autoSplit: true,
            // Por defecto SplitText añade un aria-label con el texto completo.
            // Es prohibido en elementos como <blockquote> y Lighthouse lo marca
            // como error. Partiendo por líneas o palabras el texto sigue
            // contiguo en el DOM, así que el lector de pantalla lo lee bien sin
            // necesitar la etiqueta.
            aria: 'none',
            linesClass: 'split-line',
            wordsClass: 'split-word',
            charsClass: 'split-char',
            onSplit: (self) => {
              const targets = type === 'chars' ? self.chars : type === 'words' ? self.words : self.lines;
              return gsap.from(targets, {
                yPercent: 118,
                rotate: type === 'chars' ? 4 : 2,
                duration: 1.25,
                delay: this.splitDelay(),
                stagger: this.splitStagger(),
                ease: 'mw-out',
                scrollTrigger: scroll
                  ? {
                      trigger: this.host,
                      start: 'top 86%',
                      toggleActions: 'play none none reverse',
                    }
                  : undefined,
              });
            },
          });
        },
        this.destroyRef,
      );
    });
  }
}
