/**
 * Animated homepage hero — CSS-only replica of the original LayerSlider loop.
 * 20s cycle, three scenes:
 *   1. Sun rises, flattens into a hill; moon pops up from behind it;
 *      "WELCOME EXPLORERS" fades in.  (0–8s)
 *   2. Wave-lines drift through with the tagline.  (8–15s)
 *   3. JW logo lockup.  (15.5–20s)
 * Honors prefers-reduced-motion (shows scene 1 settled, no movement).
 */
export default function Hero() {
  return (
    <section className="hero-anim" aria-label="Welcome, explorers">
      <div className="scene scene-1">
        <h1>Welcome Explorers</h1>
        <div className="moon" aria-hidden="true" />
        <div className="sunhill" aria-hidden="true" />
      </div>

      <div className="scene scene-2" aria-hidden="true">
        <img className="waves" src="/uploads/2020/01/allwaves.png" alt="" />
        <p className="tagline">
          Please enjoy these artifacts from my expeditions
          <br />
          in the world of design, art and ideas...
        </p>
      </div>

      <div className="scene scene-3" aria-hidden="true">
        <div className="lockup">
          <img
            src="/uploads/2019/09/logomark19-web-hero.png"
            alt=""
            className="lockup-mark"
          />
          <div className="lockup-name">Josh Worth</div>
          <div className="lockup-sub">Art &amp; Design</div>
        </div>
      </div>
    </section>
  );
}
