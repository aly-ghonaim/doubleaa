import { FlowRun } from "@/components/FlowRun";
import type { Project } from "@/lib/content";

interface WorkTileProps {
  project: Project;
}

export function WorkTile({ project }: WorkTileProps) {
  const { title, role, blurb, author, stack, flow, status, statusKind } =
    project;

  return (
    <article className="tile">
      <div className="tile-head">
        <h4 className="font-display">{title}</h4>
        <span className={`status status-${statusKind}`}>{status}</span>
      </div>
      <p className="tile-role">{role}</p>
      <p className="tile-blurb">{blurb}</p>

      {flow && <FlowRun flow={flow} />}

      <div className="tile-spacer" />

      <div className="tile-meta">
        <span className="by">
          by <b>{author}</b>
        </span>
        {stack && <span className="stack">{stack.join(" · ")}</span>}
      </div>
    </article>
  );
}
