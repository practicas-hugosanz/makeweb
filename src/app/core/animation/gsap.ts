/**
 * Single place where GSAP plugins get registered.
 * Import `gsap` (and plugins) from here — never from 'gsap' directly — so the
 * registration always runs exactly once, before any timeline is built.
 *
 * Only the plugins actually used ship: adding an unused one here is dead weight
 * in the bundle, because registering it is a side effect the bundler cannot
 * tree-shake away.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, TextPlugin);

// House easing — every timeline in the project pulls from these two.
gsap.registerEase('mw-out', gsap.parseEase('expo.out'));
gsap.registerEase('mw-inOut', gsap.parseEase('power3.inOut'));

gsap.defaults({ ease: 'mw-out', duration: 1 });

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, TextPlugin };
