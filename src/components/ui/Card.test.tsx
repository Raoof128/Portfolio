import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div data-testid="card-content">Card Content</div>
      </Card>
    );
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('applies default styling', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-white/10');
    expect(card).toHaveClass('bg-white/5');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('custom-card');
  });

  it('renders complex content', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Description text</p>
        <button>Action</button>
      </Card>
    );
    expect(screen.getByRole('heading', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByText(/description text/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });
});
