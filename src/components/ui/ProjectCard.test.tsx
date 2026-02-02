import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

const mockProject = {
  title: 'Test Project',
  description: 'A test project description',
  tags: ['React', 'TypeScript'],
  buildItems: ['Feature 1', 'Feature 2'],
  secureItems: ['Security 1', 'Security 2'],
  links: {
    demo: 'https://demo.example.com',
    repo: 'https://github.com/test',
    caseStudy: '/projects/test',
  },
};

describe('ProjectCard', () => {
  it('renders project title and description', () => {
    render(<ProjectCard {...mockProject} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  it('renders all tags', () => {
    render(<ProjectCard {...mockProject} />);
    mockProject.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('displays build items by default', () => {
    render(<ProjectCard {...mockProject} />);
    mockProject.buildItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('switches to secure tab when clicked', () => {
    render(<ProjectCard {...mockProject} />);
    
    const secureTab = screen.getByRole('tab', { name: /secure/i });
    fireEvent.click(secureTab);
    
    mockProject.secureItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('has correct ARIA roles for accessibility', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('renders demo link when provided', () => {
    render(<ProjectCard {...mockProject} />);
    const demoLink = screen.getByRole('link', { name: /watch demo/i });
    expect(demoLink).toHaveAttribute('href', mockProject.links.demo);
  });

  it('renders repo link when provided', () => {
    render(<ProjectCard {...mockProject} />);
    const repoLink = screen.getByRole('link', { name: /repo/i });
    expect(repoLink).toHaveAttribute('href', mockProject.links.repo);
  });

  it('renders case study link when provided', () => {
    render(<ProjectCard {...mockProject} />);
    const caseStudyLink = screen.getByRole('link', { name: /read case study/i });
    expect(caseStudyLink).toHaveAttribute('href', mockProject.links.caseStudy);
  });

  it('shows featured badge when featured prop is true', () => {
    render(<ProjectCard {...mockProject} featured />);
    expect(screen.getByText('FEATURED_OP')).toBeInTheDocument();
  });

  it('does not show featured badge when featured prop is false', () => {
    render(<ProjectCard {...mockProject} featured={false} />);
    expect(screen.queryByText('FEATURED_OP')).not.toBeInTheDocument();
  });

  it('handles project without demo link', () => {
    const projectWithoutDemo = { ...mockProject, links: { repo: mockProject.links.repo } };
    render(<ProjectCard {...projectWithoutDemo} />);
    expect(screen.queryByRole('link', { name: /watch demo/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /repo/i })).toBeInTheDocument();
  });

  it('handles project without repo link', () => {
    const projectWithoutRepo = { ...mockProject, links: { demo: mockProject.links.demo } };
    render(<ProjectCard {...projectWithoutRepo} />);
    expect(screen.queryByRole('link', { name: /repo/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /watch demo/i })).toBeInTheDocument();
  });
});
