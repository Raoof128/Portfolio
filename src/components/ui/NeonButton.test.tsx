import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NeonButton } from './NeonButton';

describe('NeonButton', () => {
  it('renders with default primary variant', () => {
    render(<NeonButton href="/test">Test Button</NeonButton>);
    const link = screen.getByRole('link', { name: /test button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders with secondary variant', () => {
    render(<NeonButton href="/test" variant="secondary">Secondary</NeonButton>);
    const link = screen.getByRole('link', { name: /secondary/i });
    expect(link).toBeInTheDocument();
  });

  it('renders with outline variant', () => {
    render(<NeonButton href="/test" variant="outline">Outline</NeonButton>);
    const link = screen.getByRole('link', { name: /outline/i });
    expect(link).toBeInTheDocument();
  });

  it('supports external links', () => {
    render(<NeonButton href="https://example.com" external>External</NeonButton>);
    const link = screen.getByRole('link', { name: /external/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('supports download attribute', () => {
    render(<NeonButton href="/resume.pdf" download>Download</NeonButton>);
    const link = screen.getByRole('link', { name: /download/i });
    expect(link).toHaveAttribute('download');
  });

  it('applies custom className', () => {
    render(<NeonButton href="/test" className="custom-class">Custom</NeonButton>);
    const link = screen.getByRole('link', { name: /custom/i });
    expect(link).toHaveClass('custom-class');
  });

  it('renders children correctly', () => {
    render(
      <NeonButton href="/test">
        <span data-testid="child">Child Content</span>
      </NeonButton>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
