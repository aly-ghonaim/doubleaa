import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Reveal } from "@/components/Reveal";
import { WorkTile } from "@/components/WorkTile";
import { CopyEmail } from "@/components/CopyEmail";
import {
  web,
  automation,
  capabilities,
  tools,
  studioQA,
  EMAIL,
  GITHUB,
} from "@/lib/content";
import type { TileSize } from "@/lib/content";

function cellClass(size?: TileSize): string {
  return size ? `cell-${size}` : "";
}

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main id="top">
        {/* Hero */}
        <section className="hero wrap">
          <h1 className="hero-title font-display">
            We build the website — and the{" "}
            <span className="mark">machine</span> behind it.
          </h1>
          <p className="hero-lede">
            We&apos;re Aly and Abdullah, a two-person studio. One of us comes
            from the front end and security, the other from full-stack and AI
            automation. We make clean, fast interfaces and the n8n workflows
            behind them — first sketch to production — so the thing you launch
            keeps running without you babysitting it.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Start a project
            </a>
            <a href="#work" className="btn btn-ghost">
              See the work
            </a>
          </div>
          <div className="proof">
            <span className="proof-label">Built with</span>
            <div className="proof-list">
              {tools.map((tool) => (
                <span key={tool} className="proof-item">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="section wrap">
          <h2 className="sec-title font-display">
            Two halves of <span className="mark">one build.</span>
          </h2>
          <p className="sec-sub">
            The interface your customers touch, and the automation that runs the
            moment they do. We do both, so the handoff never falls between two
            freelancers.
          </p>
          <div className="caps">
            {capabilities.map((cap) => (
              <Reveal key={cap.title}>
                <div className="cap">
                  <h3 className="font-display">{cap.title}</h3>
                  <p>{cap.body}</p>
                  <ul className="cap-list">
                    {cap.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Work */}
        <section id="work" className="section wrap">
          <h2 className="sec-title font-display">Selected work.</h2>
          <p className="sec-sub">
            Real projects with honest labels — built, live, designed, or in
            progress. Nothing inflated.
          </p>

          <h3 className="group-label">Web</h3>
          <div className="bento">
            {web.map((project) => (
              <Reveal key={project.title} className={cellClass(project.size)}>
                <WorkTile project={project} />
              </Reveal>
            ))}
          </div>

          <h3 className="group-label">Automation</h3>
          <div className="bento">
            {automation.map((project) => (
              <Reveal key={project.title} className={cellClass(project.size)}>
                <WorkTile project={project} />
              </Reveal>
            ))}
            <Reveal className="cell-wide">
              <div className="slot">
                <b className="font-display">More automations in progress</b>
                Additional n8n workflows are being repurposed for the studio and
                will be added here as they land.
              </div>
            </Reveal>
          </div>
        </section>

        {/* Studio */}
        <section id="studio" className="section wrap">
          <Reveal>
            <p className="studio-lede font-display">
              Two builders who&apos;d rather ship something small and{" "}
              <span className="mark">working</span> than something big and
              theoretical.
            </p>
          </Reveal>
          <div className="qa">
            {studioQA.map((item) => (
              <Reveal key={item.q}>
                <div className="qa-item">
                  <div className="qa-q">{item.q}</div>
                  <p className="qa-a">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section wrap">
          <Reveal>
            <div className="contact-band">
              <h2 className="contact-title font-display">
                Have something that needs{" "}
                <span className="mark">building</span>?
              </h2>
              <p className="contact-sub">
                A site that needs building, or a repetitive job that should run
                itself — send us the outcome you want and we&apos;ll scope it.
              </p>
              <div className="contact-row">
                <CopyEmail />
                <a
                  className="btn btn-ghost"
                  href={GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/aly-ghonaim
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <div>
            <div className="footer-brand">
              double<i>aa</i>
            </div>
            <p className="footer-note">
              Web development &amp; AI automation — Aly Ghonaim &amp; Abdullah
              Eissa.
            </p>
          </div>
          <div className="footer-contact">
            <div>
              <span className="ct-lbl">aly</span>
              <span className="selectable">{EMAIL}</span>
            </div>
            <div>
              <span className="ct-lbl">github</span>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                github.com/aly-ghonaim
              </a>
            </div>
            <div>
              <span className="ct-lbl">abdullah</span>
              <span className="selectable">Abdullah Eissa</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
