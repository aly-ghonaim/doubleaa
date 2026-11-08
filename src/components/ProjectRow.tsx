import type { Project } from "@/lib/content";

interface ProjectRowProps {
  project: Project;
  index: number;
}

export function ProjectRow({ project, index }: ProjectRowProps) {
  const { title, role, blurb, author, stack, flow, status, statusKind } =
    project;

  return (
    <article className="proj">
      <span className="proj-index font-mono">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="proj-body">
        <h3 className="font-display">{title}</h3>
        <p className="proj-role font-mono">{role}</p>
        <p className="proj-blurb">{blurb}</p>

        {flow && (
          <div className="flow" aria-label="Workflow steps">
            {flow.map((node, i) => (
              <span key={node} className="flow-step">
                <span className="node font-mono">{node}</span>
                {i < flow.length - 1 && <span className="arr">→</span>}
              </span>
            ))}
          </div>
        )}

        <div className="proj-meta font-mono">
          <span className="by">
            by <b>{author}</b>
          </span>
          {stack && (
            <>
              <span className="sep">·</span>
              <span className="stack">{stack.join(" · ")}</span>
            </>
          )}
          <span className="sep">·</span>
          <span className={`status status-${statusKind}`}>{status}</span>
        </div>
      </div>
    </article>
  );
}
