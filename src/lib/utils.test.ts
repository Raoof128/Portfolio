import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('merges simple class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles conditional class names', () => {
      const result = cn('base', false && 'hidden', true && 'visible');
      expect(result).toBe('base visible');
    });

    it('handles object syntax', () => {
      const result = cn({ active: true, disabled: false });
      expect(result).toBe('active');
    });

    it('merges tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('handles empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles null and undefined', () => {
      const result = cn('base', null, undefined, 'end');
      expect(result).toBe('base end');
    });

    it('merges complex class combinations', () => {
      const result = cn(
        'text-sm font-medium',
        'text-lg',
        { 'font-bold': true, 'italic': false }
      );
      expect(result).toContain('text-lg');
      expect(result).toContain('font-bold');
      expect(result).not.toContain('font-medium');
    });
  });
});
