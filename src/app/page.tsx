import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/Hero";
import { PageFx } from "@/components/PageFx";
import { CapsAct } from "@/components/CapsAct";
import { PipelineRun } from "@/components/PipelineRun";
import { DriftClose } from "@/components/DriftClose";
import { LinkMark } from "@/components/LinkMark";
import { MaskReveal } from "@/components/MaskReveal";
import { toWords } from "@/lib/words";
import { ProjectFolder } from "@/components/ProjectFolder";
import { CopyEmail } from "@/components/CopyEmail";
import {
  web,
  automation,
  studioQA,
  EMAIL,
  GITHUB,
} from "@/lib/content";

const STUDIO_WORDS = toWords([
  "Two builders who’d rather ship something small and",
  { mark: "working" },
  "than something big and theoretical.",
]);

const CAPS_TITLE = toWords(["Two halves of", { mark: "one build." }]);
const WORK_TITLE = toWords(["Selected work."]);
const CONTACT_TITLE = toWords(["Have something that needs", { mark: "building?" }]);

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <PageFx />
      <Nav />
      <main id="top">
        <Hero />

        {/* Capabilities */}
        <section className="section wrap">
          <h2 className="sec-title font-display">
            <MaskReveal units={CAPS_TITLE} mode="word" stagger={0.04} duration={0.45} />
          </h2>
          <p className="sec-sub">
            The interface your customers touch, and the automation that runs the
            moment they do. We do both, so the handoff never falls between two
            freelancers.
          </p>
          <CapsAct />
        </section>

        {/* The peak: the machine runs */}
        <PipelineRun />

        {/* Work */}
        <section id="work" className="section wrap">
          <h2 className="sec-title font-display">
            <MaskReveal units={WORK_TITLE} mode="word" stagger={0.04} duration={0.45} />
          </h2>
          <p className="sec-sub">
            Real projects with honest labels: built, live, designed, or in
            progress. Nothing inflated.
          </p>

          <h3 className="group-label">Web</h3>
          <div className="folders">
            {web.map((project, i) => (
              <ProjectFolder key={project.title} project={project} index={i} />
            ))}
          </div>

          <h3 className="group-label">Automation</h3>
          <div className="folders">
            {automation.map((project, i) => (
              <ProjectFolder key={project.title} project={project} index={web.length + i} />
            ))}
          </div>
          <Reveal className="slot-row" variant="panel">
            <div className="slot">
              <b className="font-display">More automations in progress</b>
              Additional n8n workflows are being repurposed for the studio and
              will be added here as they land.
            </div>
          </Reveal>
        </section>

        {/* Studio */}
        <section id="studio" className="section wrap">
          <p className="studio-lede font-display">
            <MaskReveal units={STUDIO_WORDS} mode="word" stagger={0.018} duration={0.42} />
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
          <DriftClose>
          <Reveal>
            <div className="contact-band">
              <LinkMark className="contact-mark" title="DoubleAA mark: the website and the machine, linked" />
              <h2 className="contact-title font-display">
                <MaskReveal units={CONTACT_TITLE} mode="word" stagger={0.04} duration={0.45} />
              </h2>
              <p className="contact-sub">
                A site that needs building, or a repetitive job that should run
                itself. Send us the outcome you want and we&apos;ll scope it.
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
          </DriftClose>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <div>
            <div className="footer-brand">
              Double<i>AA</i>
            </div>
            <p className="footer-note">
              Web development &amp; AI automation, by Aly Ghonaim &amp; Abdullah
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
