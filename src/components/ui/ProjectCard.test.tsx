import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProjectCard, type ProjectCardProps } from "./ProjectCard";
import { I18nProvider } from "@/i18n/provider";
import en from "@/i18n/locales/en";

function renderCard(props: ProjectCardProps) {
  return render(
    <I18nProvider locale="en" dictionary={en}>
      <ProjectCard {...props} />
    </I18nProvider>,
  );
}

const mockProject = {
  title: "Test Project",
  description: "A test project description",
  tags: ["React", "TypeScript"],
  buildItems: ["Feature 1", "Feature 2"],
  secureItems: ["Security 1", "Security 2"],
  links: {
    demo: "https://demo.example.com",
    repo: "https://github.com/test",
    caseStudy: "/projects/test",
  },
};

describe("ProjectCard", () => {
  it("renders project title and description", () => {
    renderCard(mockProject);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("A test project description")).toBeInTheDocument();
  });

  it("renders all tags", () => {
    renderCard(mockProject);
    mockProject.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("displays build items by default", () => {
    renderCard(mockProject);
    mockProject.buildItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("switches to secure tab when clicked", async () => {
    renderCard(mockProject);

    const secureTab = screen.getByRole("tab", { name: /secure/i });
    fireEvent.click(secureTab);

    await waitFor(() => {
      mockProject.secureItems.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });

  it("has correct ARIA roles for accessibility", () => {
    renderCard(mockProject);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });

  it("keeps tab controls bound to a stable panel id", () => {
    renderCard(mockProject);

    const buildTab = screen.getByRole("tab", { name: /build/i });
    const secureTab = screen.getByRole("tab", { name: /secure/i });
    const panel = screen.getByRole("tabpanel");

    expect(buildTab).toHaveAttribute("aria-controls", panel.getAttribute("id"));
    expect(secureTab).toHaveAttribute(
      "aria-controls",
      panel.getAttribute("id"),
    );
    expect(panel.getAttribute("id")).not.toContain(" ");
  });

  it("renders demo link when provided", () => {
    renderCard(mockProject);
    const demoLink = screen.getByRole("link", { name: /watch demo/i });
    expect(demoLink).toHaveAttribute("href", mockProject.links.demo);
  });

  it("renders repo link when provided", () => {
    renderCard(mockProject);
    const repoLink = screen.getByRole("link", { name: /repo/i });
    expect(repoLink).toHaveAttribute("href", mockProject.links.repo);
  });

  it("renders case study link when provided", () => {
    renderCard(mockProject);
    const caseStudyLink = screen.getByRole("link", {
      name: /read case study/i,
    });
    expect(caseStudyLink).toHaveAttribute("href", mockProject.links.caseStudy);
  });

  it("shows featured badge when featured prop is true", () => {
    renderCard({ ...mockProject, featured: true });
    expect(screen.getByText("FEATURED_OP")).toBeInTheDocument();
  });

  it("does not show featured badge when featured prop is false", () => {
    renderCard({ ...mockProject, featured: false });
    expect(screen.queryByText("FEATURED_OP")).not.toBeInTheDocument();
  });

  it("handles project without demo link", () => {
    const projectWithoutDemo = {
      ...mockProject,
      links: { repo: mockProject.links.repo },
    };
    renderCard(projectWithoutDemo);
    expect(
      screen.queryByRole("link", { name: /watch demo/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /repo/i })).toBeInTheDocument();
  });

  it("handles project without repo link", () => {
    const projectWithoutRepo = {
      ...mockProject,
      links: { demo: mockProject.links.demo },
    };
    renderCard(projectWithoutRepo);
    expect(
      screen.queryByRole("link", { name: /repo/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /watch demo/i }),
    ).toBeInTheDocument();
  });
});
