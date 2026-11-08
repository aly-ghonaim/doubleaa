import type { Project } from "@/lib/content";

interface WorkTileProps {
  project: Project;
  index: number;
}

export function WorkTile({ project, index }: WorkTileProps) {
  const { title, role, blurb, author, stack, flow, status, statusKind, size } =
    project;

  return (
    <article className={`tile${size ? ` ${size}` : ""}`}>
      <div className="tile-head">
        <span className="tile-index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`status status-${statusKind}`}>{status}</span>
      </div>

      <h4 className="font-display">{title}</h4>
      <p className="tile-role">{role}</p>
      <p className="tile-blurb">{blurb}</p>

      {flow && (
        <div className="flow" aria-label="Workflow steps">
          {flow.map((node, i) => (
            <span key={node} className="flow-step">
              <span className="node">{node}</span>
              {i < flow.length - 1 && <span className="arr">→</span>}
            </span>
          ))}
        </div>
      )}

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
