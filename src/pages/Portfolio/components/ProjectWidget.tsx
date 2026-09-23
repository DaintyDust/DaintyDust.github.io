import { useState } from "react";
import type { ProjectItem } from "../types";
import ProjectCarousel from "./ProjectCarousel";
import GithubLogo from "@/assets/Socials/Github_Logo.png";

interface ProjectWidgetProps {
  project: ProjectItem;
}

export default function ProjectWidget({ project }: ProjectWidgetProps) {
  const [collapsed, setCollapsed] = useState(false);

  const images = project.images && project.images.length > 0 ? project.images : project.image ? [project.image] : [];

  return (
    <div className={`project-widget${collapsed ? " collapsed" : ""}`}>
      <div
        className="social-widget-header"
        onClick={() => setCollapsed(!collapsed)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setCollapsed(!collapsed);
          }
        }}
      >
        <div className="project-header-left">
          <h3 className="project-widget-title">{project.title}</h3>
          {project.date && <span className="project-date-badge">{project.date}</span>}
        </div>

        <button
          type="button"
          className="widget-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed(!collapsed);
          }}
          aria-label={collapsed ? "Expand project" : "Collapse project"}
        >
          {collapsed ? "+" : "−"}
        </button>
      </div>

      <div className="social-widget-content">
        {images.length > 0 && <ProjectCarousel images={images} title={project.title} />}

        <p className="project-description">{project.description}</p>

        {project.languages && project.languages.length > 0 && (
          <div className="project-languages">
            {project.languages.map((lang) =>
              lang.badgeUrl ? (
                <img key={lang.name} src={lang.badgeUrl} alt={lang.name} title={lang.name} className="project-lang-badge" />
              ) : (
                <span key={lang.name} className="project-lang-text-badge">
                  {lang.name}
                </span>
              ),
            )}
          </div>
        )}

        {(project.githubUrl || project.externalUrl) && (
          <div className="project-actions">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-btn">
                <img src={GithubLogo} alt="GitHub" />
                GitHub
              </a>
            )}
            {project.externalUrl && (
              <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="project-btn">
                {project.externalUrlLabel || "Visit Page"}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
