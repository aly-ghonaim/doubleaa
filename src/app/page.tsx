import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Reveal } from "@/components/Reveal";
import { WorkTile } from "@/components/WorkTile";
import { CopyEmail } from "@/components/CopyEmail";
import { web, automation, studioQA, EMAIL, GITHUB } from "@/lib/content";
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
          <div className="hero-aura" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hero-inner">
            <p className="eyebrow">A two-person studio · Web & AI automation</p>
            <h1 className="hero-title font-display">
              We build the <em>website</em> and the <em>machine</em> behind it.
            </h1>
            <p className="hero-lede">
              We&apos;re Aly and Abdullah. One of us comes from the front end
              and security, the other from full-stack and AI automation. We make
              clean, fast interfaces and the n8n workflows behind them — first
              sketch to production — so the thing you launch keeps running
              without you babysitting it.
            </p>
            <div className="who-row">
              <div className="who">
                <span className="who-name">Aly Ghonaim</span>
                <span className="who-role">
                  Front-end &amp; security · Red Team Diploma
                </span>
              </div>
              <div className="who">
                <span className="who-name">Abdullah Eissa</span>
                <span className="who-role">Full-stack &amp; AI automation</span>
              </div>
            </div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="section wrap">
          <div className="sec-head">
            <p className="sec-label">Work</p>
            <h2 className="sec-title font-display">
              Sites that <em>look</em> the part, systems that <em>do</em> the
              work.
            </h2>
          </div>

          <h3 className="group-label">Web</h3>
          <div className="bento">
            {web.map((project, i) => (
              <Reveal key={project.title} className={cellClass(project.size)}>
                <WorkTile project={project} index={i} />
              </Reveal>
            ))}
          </div>

          <h3 className="group-label">Automation</h3>
          <div className="bento">
            {automation.map((project, i) => (
              <Reveal key={project.title} className={cellClass(project.size)}>
                <WorkTile project={project} index={i} />
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
          <div className="sec-head">
            <p className="sec-label">Studio</p>
          </div>
          <Reveal>
            <p className="studio-lede">
              Two builders who&apos;d rather ship something small and{" "}
              <em>working</em> than something big and theoretical.
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
            <div className="contact-card">
              <p className="sec-label">Contact</p>
              <h2 className="sec-title font-display" style={{ marginTop: 10 }}>
                Have something that needs <em>building</em>?
              </h2>
              <p className="contact-lede">
                A site that needs building, or a repetitive job that should run
                itself — send us the outcome you want and we&apos;ll scope it.
              </p>
              <div className="contact-row">
                <CopyEmail />
                <a
                  className="btn"
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
              double<i>a</i>
              <i>a</i>
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
