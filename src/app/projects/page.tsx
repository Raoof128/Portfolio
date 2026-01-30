import { ProjectCard } from "@/components/ui/ProjectCard";

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">
        <span className="text-cyan font-mono mr-3">/</span>Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mehr Guard */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <ProjectCard
            featured
            title="Mehr Guard"
            description="Advanced security monitoring system with real-time threat detection."
            tags={["Next.js", "Python", "Deep Learning"]}
            buildItems={[
              "Microservices architecture using gRPC",
              "Real-time websocket feeds for alerts",
              "Dashboard optimized for SOC teams"
            ]}
            secureItems={[
              "Zero-trust authentication flow",
              "End-to-end encryption for logs",
              "Privacy-preserving AI models"
            ]}
            links={{
              demo: "https://www.youtube.com/watch?v=n8bheouj4jM",
              caseStudy: "/projects/mehr-guard"
            }}
          />
        </div>

        {/* GitSwitch */}
        <ProjectCard
          title="GitSwitch"
          description="Context-aware git profile switcher for developers."
          tags={["Rust", "CLI", "Productivity"]}
          buildItems={[
            "Native binary performance (Rust)",
            "Cross-platform file system watcher",
            "Shell integration (Zsh/Bash)"
          ]}
          secureItems={[
            "Local-only data storage",
            "Sign commits automatically with GPG",
            "No telemetry"
          ]}
          links={{
            repo: "https://github.com/Raoof128/GitSwitch",
            caseStudy: "/projects/gitswitch"
          }}
        />

        {/* ECRSM */}
        <ProjectCard
          title="ECRSM"
          description="Experimental Container Runtime Security Monitor."
          tags={["eBPF", "Go", "Linux"]}
          buildItems={[
            "Kernel-level observability",
            "Low overhead (<1% CPU)",
            "JSON logging output"
          ]}
          secureItems={[
            "Read-only eBPF probes",
            "Detects shell execution in containers",
            "Rootkit evasion detection"
          ]}
          links={{
            repo: "https://github.com/Raoof128/ECRSM",
            caseStudy: "/projects/ecrsm"
          }}
        />
      </div>
    </div>
  );
}
