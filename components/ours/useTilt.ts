'use client';

import { useEffect, useRef } from 'react';

// Tilt parallax for the page's floating objects (the catalog, the
// ticket, the pyramid). On a phone the device's orientation nudges the
// object a few degrees; with a mouse, the pointer's position does the
// same. Applied as a perspective rotate on a WRAPPER around the object,
// so the object's own spin/bob animations are untouched. Off entirely
// under prefers-reduced-motion.
//
// iOS only hands out orientation events after a user gesture grants
// them, so the first touch anywhere asks once; Android and desktop
// browsers just start.
export function useTilt(maxDeg = 6) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const apply = () => {
      raf = 0;
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      el.style.transform = `perspective(900px) rotateX(${cy.toFixed(2)}deg) rotateY(${cx.toFixed(2)}deg)`;
      if (Math.abs(tx - cx) > 0.02 || Math.abs(ty - cy) > 0.02) raf = requestAnimationFrame(apply);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    // phone: gamma = left/right roll, beta = front/back pitch. Centre
    // the pitch on a natural ~40° hand-held angle.
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = clamp(e.gamma / 35) * maxDeg;
      ty = clamp((e.beta - 40) / 35) * -maxDeg;
      kick();
    };
    // desktop: the pointer's offset from the object's centre
    const onMouse = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const fx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const fy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      tx = clamp(fx * 2) * maxDeg;
      ty = clamp(-fy * 2) * maxDeg;
      kick();
    };

    const fine = window.matchMedia('(pointer: fine)').matches;
    if (fine) window.addEventListener('mousemove', onMouse, { passive: true });

    const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
    let orientOn = false;
    const start = () => {
      if (orientOn) return;
      orientOn = true;
      window.addEventListener('deviceorientation', onOrient, { passive: true });
    };
    const ask = () => {
      DOE?.requestPermission?.()
        .then((s) => {
          if (s === 'granted') start();
        })
        .catch(() => {});
    };
    if (DOE && typeof DOE.requestPermission === 'function') {
      window.addEventListener('touchend', ask, { once: true, passive: true });
    } else if (DOE) {
      start();
    }

    return () => {
      if (fine) window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchend', ask);
      if (orientOn) window.removeEventListener('deviceorientation', onOrient);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [maxDeg]);

  return ref;
}
