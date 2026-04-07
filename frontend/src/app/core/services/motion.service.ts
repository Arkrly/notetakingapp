import { Injectable } from '@angular/core';
import { animate, stagger, inView } from 'framer-motion';

@Injectable({ providedIn: 'root' })
export class MotionService {

  fadeUp(selector: string, options?: { delay?: number; staggerDelay?: number }) {
    animate(
      selector,
      { opacity: [0, 1], y: [24, 0] } as any,
      {
        duration: 0.45,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
        delay: options?.staggerDelay ? stagger(options.staggerDelay) : (options?.delay ?? 0)
      }
    );
  }

  fadeIn(selector: string, delay = 0) {
    animate(selector, { opacity: [0, 1] } as any, { duration: 0.3, delay, ease: 'easeOut' as any });
  }

  slideInLeft(selector: string) {
    animate(selector, { opacity: [0, 1], x: [-20, 0] } as any, { duration: 0.35, ease: 'easeOut' as any });
  }

  scaleIn(selector: string) {
    animate(selector, { opacity: [0, 1], scale: [0.95, 1] } as any, { duration: 0.3, ease: 'easeOut' as any });
  }

  onScrollInView(selector: string) {
    inView(selector, (entry: any) => {
      animate(entry.target as unknown as Element, { opacity: [0, 1], y: [32, 0], scale: [0.96, 1] } as any, { type: 'spring', stiffness: 260, damping: 20 });
    });
  }

  staggerSpring(selector: string, delay = 0) {
    animate(
      selector,
      { opacity: [0, 1], y: [24, 0], scale: [0.96, 1] } as any,
      { delay: stagger(0.07, { startDelay: delay }), type: 'spring', stiffness: 300, damping: 24 }
    );
  }

  heroReveal(selector: string) {
    animate(
      selector,
      { opacity: [0, 1], y: [40, 0] } as any,
      { delay: stagger(0.04), duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
    );
  }

  pulseAttention(selector: string) {
    animate(selector, { scale: [1, 1.04, 1] } as any, { duration: 1.8, repeat: Infinity, ease: 'ease-in-out' as any });
  }

  fadeExit(selector: string): Promise<void> {
    return animate(
      selector,
      { opacity: [1, 0], y: [0, -16] } as any,
      { duration: 0.2 }
    ).finished as Promise<void>;
  }

  countUp(element: HTMLElement, target: number, duration = 1.2) {
    animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1] as any,
      onUpdate: (v: any) => { if (element) element.textContent = Math.round(v).toString(); }
    });
  }
}