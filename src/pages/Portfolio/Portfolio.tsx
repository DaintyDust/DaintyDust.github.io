import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import Background from "@/features/Background/Index";
import ProjectWidget from "./components/ProjectWidget";
import { projectsData } from "./data/projects";
import "./Portfolio.css";

export default function Portfolio() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [itemHeights, setItemHeights] = useState<Record<string, number>>({});

  const displayedProjects = useMemo(() => {
    return [...projectsData].sort((a, b) => {
      const yearA = parseInt(a.date || "0", 10);
      const yearB = parseInt(b.date || "0", 10);
      return sortOrder === "asc" ? yearA - yearB : yearB - yearA;
    });
  }, [sortOrder]);

  useEffect(() => {
    const elements = Array.from(itemRefs.current.values());
    if (elements.length === 0) return;

    const measure = () => {
      const next: Record<string, number> = {};
      let changed = false;
      itemRefs.current.forEach((el, id) => {
        const h = Math.round(el.getBoundingClientRect().height);
        next[id] = h;
        if (itemHeights[id] !== h) {
          changed = true;
        }
      });
      if (changed) {
        setItemHeights(next);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [displayedProjects, isMobile, itemHeights]);

  const { positions, totalHeight } = useMemo(() => {
    const pos: number[] = [];

    for (let i = 0; i < displayedProjects.length; i++) {
      if (i === 0) {
        pos[0] = 0;
      } else if (i === 1) {
        const prevId = displayedProjects[0].id;
        const prevH = itemHeights[prevId] || 320;
        pos[1] = Math.round(Math.max(pos[0] + prevH * 0.5, pos[0] + Math.min(prevH, 60) + 16, pos[0] + 50));
      } else {
        const sameSideId = displayedProjects[i - 2].id;
        const sameSideH = itemHeights[sameSideId] || 320;
        const sameSideGap = Math.round(Math.max(60, sameSideH * 0.5));
        const afterSameSide = pos[i - 2] + sameSideH + sameSideGap;
        const oppId = displayedProjects[i - 1].id;
        const oppH = itemHeights[oppId] || 320;
        const oppStagger = Math.round(oppH * 0.5);
        const afterOpposite = Math.round(Math.max(pos[i - 1] + oppStagger, pos[i - 1] + Math.min(oppH, 60) + 16));
        const minChronological = pos[i - 1] + Math.max(60, Math.round(oppH * 0.35));

        pos[i] = Math.max(afterSameSide, afterOpposite, minChronological);
      }
    }

    const maxBottom = displayedProjects.reduce((max, proj, idx) => {
      const bottom = (pos[idx] ?? 0) + (itemHeights[proj.id] || 320);
      return Math.max(max, bottom);
    }, 0);

    return { positions: pos, totalHeight: maxBottom + 60 };
  }, [displayedProjects, itemHeights]);

  return (
    <>
      <Background />

      <Link to="/" className="back-button">
        ← Back
      </Link>

      <div className="portfolio-scroll-container">
        <div className="portfolio-header">
          <h1 className="portfolio-title">PROJECT ARCHIVE</h1>
          <p className="portfolio-subtitle">Timeline of developments, systems, and experiments</p>
          <button type="button" className="portfolio-sort-btn" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            Sort: {sortOrder === "asc" ? "Oldest to Newest ↑" : "Newest to Oldest ↓"}
          </button>
        </div>

        {isMobile ? (
          <div className="portfolio-timeline single-column">
            {displayedProjects.map((project) => (
              <div key={project.id} className="portfolio-item">
                <ProjectWidget project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="portfolio-timeline staggered-layout" style={{ height: `${totalHeight}px` }}>
            {displayedProjects.map((project, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    if (el) {
                      itemRefs.current.set(project.id, el);
                    } else {
                      itemRefs.current.delete(project.id);
                    }
                  }}
                  className={`portfolio-item ${isLeft ? "item-left" : "item-right"}`}
                  style={{ top: `${positions[index] ?? 0}px` }}
                >
                  <ProjectWidget project={project} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
