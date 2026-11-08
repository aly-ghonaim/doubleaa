import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { ProjectRow } from "@/components/ProjectRow";
import { CopyEmail } from "@/components/CopyEmail";
import { web, automation, studioQA, EMAIL, GITHUB } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        {/* Hero */}
        <section className="wrap hero">
          <p className="eyebrow font-mono">A two-person studio</p>
          <h1 className="hero-title font-display">
            We build the <em>website</em> and the <em>machine</em> that runs
            behind it.
          </h1>
          <p className="hero-lede">
            We&apos;re Aly and Abdullah. One of us comes from the front end and
            security, the other from full-stack and AI automation. We make
            clean, fast interfaces and the n8n workflows behind them — first
            sketch to production — so the thing you launch keeps running without
            you babysitting it.
          </p>
          <div className="who-row">
            <div className="who">
              <span className="who-name font-display">Aly Ghonaim</span>
              <span className="who-role font-mono">
                Front-end &amp; security · Red Team Diploma
              </span>
            </div>
            <div className="who">
              <span className="who-name font-display">Abdullah</span>
              <span className="who-role font-mono">
                Full-stack &amp; AI automation
              </span>
            </div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="wrap section">
          <h2 className="sec-label font-mono">Work</h2>

          <h3 className="group-label font-mono">Web</h3>
          <div className="proj-list">
            {web.map((project, i) => (
              <Reveal key={project.title}>
                <ProjectRow project={project} index={i} />
              </Reveal>
            ))}
          </div>

          <h3 className="group-label font-mono">Automation</h3>
          <div className="proj-list">
            {automation.map((project, i) => (
              <Reveal key={project.title}>
                <ProjectRow project={project} index={i} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="slot">
              <b className="font-display">More automations in progress</b>
              Additional n8n workflows are being repurposed for the studio and
              will be added here as they land.
            </div>
          </Reveal>
        </section>

        {/* Studio */}
        <section id="studio" className="wrap section">
          <h2 className="sec-label font-mono">Studio</h2>
          <Reveal>
            <p className="studio-lede font-display">
              Two builders who&apos;d rather ship something small and{" "}
              <em>working</em> than something big and theoretical.
            </p>
          </Reveal>
          <div className="qa">
            {studioQA.map((item) => (
              <Reveal key={item.q}>
                <div className="qa-item">
                  <div className="qa-q font-mono">{item.q}</div>
                  <p className="qa-a">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="wrap section">
          <h2 className="sec-label font-mono">Contact</h2>
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
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <div>
            <div className="footer-brand font-display">
              double<i>a</i><i>a</i>
            </div>
            <p className="footer-note font-mono">
              Web development &amp; AI automation — Aly Ghonaim &amp; Abdullah.
            </p>
          </div>
          <div className="footer-contact font-mono">
            <div>
              <span className="ct-lbl">aly</span>&nbsp;&nbsp;
              <span className="selectable">{EMAIL}</span>
            </div>
            <div>
              <span className="ct-lbl">aly</span>&nbsp;&nbsp;
              <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                github.com/aly-ghonaim
              </a>
            </div>
            <div>
              <span className="ct-lbl">abdullah</span>&nbsp;&nbsp;— contact to
              add
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
