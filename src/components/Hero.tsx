import SilkMeshShaderHero from "@/components/ui/silk-mesh-shader-hero";

/*
 * Hero — the landing screen: a claret silk shader with the studio's headline.
 * Copy is the site's existing hero copy; `*machine*` renders as the peach italic.
 */
export function Hero() {
  return (
    <SilkMeshShaderHero
      className="hero-silk"
      eyebrow="Web development & AI automation"
      title={"We build the website —\nand the *machine*\nbehind it."}
      description="We're Aly and Abdullah, a two-person studio. Clean, fast interfaces and the n8n workflows behind them, so the thing you launch keeps running without you babysitting it."
      primaryCta={{ label: "Start a project", href: "#contact" }}
      secondaryCta={{ label: "See the work", href: "#work" }}
      caption={"Aly Ghonaim & Abdullah Eissa\nWeb · n8n · AI"}
      palette="claret"
      height="calc(100svh - var(--bar-h))"
    />
  );
}
