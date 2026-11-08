import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/Hero";
import { MaskReveal } from "@/components/MaskReveal";
import { toWords } from "@/lib/words";
import { WorkTile } from "@/components/WorkTile";
import { CopyEmail } from "@/components/CopyEmail";
import {
  web,
  automation,
  capabilities,
  studioQA,
  EMAIL,
  GITHUB,
} from "@/lib/content";
import type { TileSize } from "@/lib/content";

const STUDIO_WORDS = toWords([
  "Two builders who’d rather ship something small and",
  { mark: "working" },
  "than something big and theoretical.",
]);

function cellClass(size?: TileSize): string {
  return size ? `cell-${size}` : "";
}

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main id="top">
        <Hero />

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
            {capabilities.map((cap, i) => (
              <Reveal key={cap.title} variant={i % 2 === 0 ? "left" : "right"}>
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
            {web.map((project, i) => (
              <Reveal
                key={project.title}
                variant="panel"
                index={i}
                className={cellClass(project.size)}
              >
                <WorkTile project={project} />
              </Reveal>
            ))}
          </div>

          <h3 className="group-label">Automation</h3>
          <div className="bento">
            {automation.map((project, i) => (
              <Reveal
                key={project.title}
                variant="panel"
                index={i}
                className={cellClass(project.size)}
              >
                <WorkTile project={project} />
              </Reveal>
            ))}
            <Reveal className="cell-wide" variant="panel" index={automation.length}>
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
          <p className="studio-lede font-display">
            <MaskReveal units={STUDIO_WORDS} mode="word" stagger={0.03} duration={0.6} />
          </p>
          <div className="qa">
            {studioQA.map((item, i) => (
              <Reveal key={item.q} index={i}>
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
