import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/Hero";
import { Machine } from "@/components/Machine";
import { MaskReveal } from "@/components/MaskReveal";
import { toWords } from "@/lib/words";
import { WorkShowcase } from "@/components/WorkShowcase";
import { AutomationWalkthrough } from "@/components/AutomationWalkthrough";
import { CopyEmail } from "@/components/CopyEmail";
import { capabilities, studioQA, EMAIL, GITHUB } from "@/lib/content";

const STUDIO_WORDS = toWords([
  "Two builders who’d rather ship something small and",
  { mark: "working" },
  "than something big and theoretical.",
]);

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

        {/* Work — scroll ribbon on desktop, bento everywhere else */}
        <section id="work">
          <WorkShowcase />
        </section>

        {/* Automations — scroll walkthrough of the three n8n systems */}
        <section id="automations">
          <AutomationWalkthrough />
        </section>

        {/* The machine — signature focal block */}
        <section id="machine" className="section wrap">
          <Reveal variant="panel">
            <div className="machine-band">
              <div className="machine-grid">
                <div className="machine-copy">
                  <h2 className="font-display">
                    The website, and the{" "}
                    <span className="mark">machine</span> behind it.
                  </h2>
                  <p>
                    Most studios hand you a site and walk away. We wire the
                    workflow that runs after launch — intake, triage, and reply,
                    moving on their own. Here&apos;s the shape of a real one.
                  </p>
                  <div className="machine-tag">
                    live schematic · <b>Lead Capture &amp; AI Dispatch</b>
                  </div>
                </div>
                <Machine />
              </div>
            </div>
          </Reveal>
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
            <p className="footer-locale">
              <b>Cairo</b> · GMT+2 — Aly. Abdullah: contact detail pending.
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
