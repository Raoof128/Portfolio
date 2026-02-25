import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js image
vi.mock('next/image', () => ({
  default: function ImageMock(props: { src: string; alt: string; [key: string]: unknown }) {
    const { src, alt, ...rest } = props;
    delete rest.fill;
    delete rest.priority;
    delete rest.unoptimized;
    delete rest.loader;
    return React.createElement('img', { src, alt, ...rest });
  },
}));

// Mock IntersectionObserver for framer-motion useInView
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [0];
  takeRecords = vi.fn().mockReturnValue([]);

  constructor(callback: IntersectionObserverCallback) {
    // Immediately report all observed elements as intersecting
    setTimeout(() => {
      callback([{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry], this);
    }, 0);
  }
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
