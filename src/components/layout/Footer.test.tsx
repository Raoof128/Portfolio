import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders social links', () => {
    render(<Footer />);

    expect(screen.getByText('GitHub').closest('a')).toHaveAttribute('href', 'https://github.com/Raoof128');
    expect(screen.getByText('LinkedIn').closest('a')).toHaveAttribute('href', 'https://linkedin.com/in/mohammad-raouf-abedini-885a9226a');
    const contactLinks = screen.getAllByText('Contact');
    expect(contactLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders system status', () => {
    render(<Footer />);
    expect(screen.getByText(/status: online/i)).toBeInTheDocument();
  });

  it('renders last index date', () => {
    render(<Footer />);
    expect(screen.getByText(/last index:/i)).toBeInTheDocument();
  });

  it('renders security.txt link', () => {
    render(<Footer />);
    const securityLink = screen.getByText(/security\.txt/i);
    expect(securityLink.closest('a')).toHaveAttribute('href', '/.well-known/security.txt');
  });

  it('has correct structure', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Projects').closest('a')).toHaveAttribute('href', '/projects');
    expect(screen.getByText('Resume').closest('a')).toHaveAttribute('href', '/resume');
  });

  it('renders copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/mohammad raouf abedini/i)).toBeInTheDocument();
  });
});
