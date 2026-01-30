import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">
        <span className="text-cyan font-mono mr-3">/</span>Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(projects).map((project) => (
          <div key={project.slug} className={project.slug === "mehr-guard" ? "col-span-1 md:col-span-2 lg:col-span-3" : ""}>
            <ProjectCard
              featured={project.slug === "mehr-guard"}
              title={project.title}
              description={project.description}
              tags={project.tags}
              buildItems={project.build.features.slice(0, 3)} // Show top 3 features
              secureItems={project.secure.measures.slice(0, 3)} // Show top 3 security measures
              links={project.links}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
