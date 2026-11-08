"use client";

import { useEffect, useRef, useState } from "react";
import GlassFolder, { type ArtRecipe, type FolderFile } from "@/components/ui/glass-folder-cards";
import { FlowRun } from "@/components/FlowRun";
import type { Project } from "@/lib/content";
import { useTheme } from "@/lib/theme";

// Generated art in the DoubleAA palette: navy, electric blue, brushed silver.
// Two recipes, alternated down the grid so neighbouring folders differ.
const NAVY_MARBLE: ArtRecipe = {
  style: "marble",
  colors: ["#03060f", "#0b1a3a", "#1f57d9", "#08101f", "#5c9bff", "#c3cad6", "#eef2f8"],
  scale: 0.66,
  warp: 3.2,
  angle: -0.5,
  gloss: 0.55,
  veins: 0.45,
};
const SILVER_STREAK: ArtRecipe = {
  style: "streak",
  colors: ["#eef2f8", "#c3cad6", "#5c9bff", "#0b1a3a", "#1f57d9", "#9fb4d8", "#f1f5fb"],
  scale: 0.7,
  warp: 1.5,
  angle: -0.62,
  gloss: 0.22,
  veins: 0,
};
const BLUE_SHEET: ArtRecipe = {
  style: "marble",
  colors: ["#050a16", "#12306e", "#2f6ae8", "#0b1a3a", "#8fb6ff", "#e8eef8"],
  scale: 0.72,
  warp: 3.4,
  angle: 1.1,
  gloss: 0.5,
  veins: 0.35,
};

const MAX_WIDTH = 340;

/** The project's real details, as the files inside its folder (front of the stack last). */
function filesFor(p: Project): FolderFile[] {
  const files: FolderFile[] = [{ name: p.role, meta: "Brief" }];
  if (p.stack?.length) files.push({ name: p.stack.join(" · "), meta: "Stack" });
  if (p.flow?.length) files.push({ name: p.flow.join(" → "), meta: `${p.flow.length} steps` });
  files.push({ name: `Built by ${p.author}`, meta: p.status, art: BLUE_SHEET });
  return files;
}

interface ProjectFolderProps {
  project: Project;
  index: number;
}

/**
 * One project, as a glass folder you can open. Hover leans the glass, click
 * fans the details out. The description and status sit under the folder as
 * plain text, so nothing important is hidden inside an interaction.
 */
export function ProjectFolder({ project, index }: ProjectFolderProps) {
  const { title, blurb, author, flow, status, statusKind } = project;
  const theme = useTheme();
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);

  // Fit the folder to its column (it is drawn at a fixed pixel width).
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.round(Math.min(MAX_WIDTH, entry.contentRect.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <article className="pf">
      <h4 className="sr-only">{title}</h4>
      <div ref={boxRef} className="pf-folder">
        <GlassFolder
          label={title}
          meta={`by ${author}`}
          tone={theme}
          art={index % 2 === 0 ? NAVY_MARBLE : SILVER_STREAK}
          seed={7 + index * 13}
          files={filesFor(project)}
          action="none"
          width={width}
          appearDelay={(index % 3) * 90}
        />
      </div>
      <div className="pf-body">
        <span className={`status status-${statusKind}`}>{status}</span>
        <p className="pf-blurb">{blurb}</p>
        {flow && <FlowRun flow={flow} />}
      </div>
    </article>
  );
}
