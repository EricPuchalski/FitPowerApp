// src/types/fireworks-js.d.ts
declare module 'fireworks-js' {
    interface FireworksOptions {
      hue?: { min: number; max: number };
      delay?: { min: number; max: number };
      rocketsPoint?: number;
      speed?: number;
      acceleration?: number;
      friction?: number;
      gravity?: number;
      particles?: number;
      trace?: number;
      explosion?: number;
      boundaries?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
      };
      sound?: {
        enable?: boolean;
        list?: string[];
      };
    }
  
    class Fireworks {
      constructor(canvas: HTMLCanvasElement, options?: FireworksOptions);
      start(): void;
      stop(): void;
    }
  
    export { Fireworks };
  }
  