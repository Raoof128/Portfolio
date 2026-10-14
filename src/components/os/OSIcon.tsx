import { BookOpen, FileText, FolderOpen, Mail, UserRound } from "lucide-react";

export type PortfolioApp =
  | "projects"
  | "research"
  | "about"
  | "resume"
  | "contact";

const icons = {
  projects: FolderOpen,
  research: BookOpen,
  about: UserRound,
  resume: FileText,
  contact: Mail,
};

export function OSIcon({
  app,
  dimensional = false,
}: {
  app: PortfolioApp;
  dimensional?: boolean;
}) {
  const Icon = icons[app];
  return (
    <span
      className={
        dimensional
          ? `os-app-icon os-app-icon--${app}`
          : `os-small-icon os-small-icon--${app}`
      }
    >
      <Icon aria-hidden="true" strokeWidth={1.5} />
    </span>
  );
}

export function OSMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3.5h8.35c4.48 0 7.15 2.3 7.15 6.05 0 2.63-1.4 4.58-3.82 5.5L20.5 20.5h-4.34l-4.27-5.16H7.5v5.16H4V3.5Z M7.5 6.75v5.3h4.65c2.38 0 3.85-.88 3.85-2.65s-1.47-2.65-3.85-2.65H7.5Z M7.5 14.15l2.75-2.1h1.9l-3.45 3.29H7.5v-1.19Z"
      />
    </svg>
  );
}
