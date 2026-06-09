"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchMascotGallery, type MascotPhoto } from "../lib/supabase";

// Pre-launch: invite people to the testing community (feeds Play closed testing).
// Swap to the Play Store / App Store links at public launch.
const TESTING_URL =
  "mailto:support@pawpoints.co.nz?subject=Join%20the%20PawPoints%20testing%20community&body=Hi%20PawPoints%20team%2C%0A%0AI%27d%20love%20to%20join%20the%20testing%20community%20and%20try%20PawPoints%20before%20launch.%0A%0ADevice%20(Android%20%2F%20iPhone)%3A%20%0AGoogle%20email%20for%20Android%20testing%3A%20%0A%0AThanks!";

function formatGalleryDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

const PawLogo = ({ size = 30, pink = "#FF7AAE", white = "#fff" }: { size?: number; pink?: string; white?: string }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden="true">
    <circle cx="22" cy="26" r="6" fill={white} />
    <circle cx="38" cy="26" r="6" fill={white} />
    <circle cx="30" cy="16" r="6" fill={pink} />
    <path d="M20 40 C20 31 40 31 40 40 C40 51 33 56 30 56 C27 56 20 51 20 40 Z" fill={white} />
  </svg>
);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mascots, setMascots] = useState<MascotPhoto[]>([]);

  useEffect(() => {
    fetchMascotGallery(12).then(setMascots).catch(() => {});
  }, []);

  return (
    <div className="pp-home">
      <header>
        <div className="wrap">
          <nav>
            <a className="logo" href="#top">
              <PawLogo />
              PawPoints
            </a>
            <div className="nav-links">
              <a href="#how">How it works</a>
              <a href="#fair">Fair-Paw goals</a>
              <a href="#partners">For businesses</a>
              <a href="#get" className="nav-cta">Join testing</a>
            </div>
            <button className="burger" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </nav>
          <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#fair" onClick={() => setMenuOpen(false)}>Fair-Paw goals</a>
            <a href="#partners" onClick={() => setMenuOpen(false)}>For businesses</a>
            <a href="#get" onClick={() => setMenuOpen(false)}>Join testing</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <span className="eyebrow">🇳🇿 Made in Auckland · Free for walkers, forever</span>
              <h1>Every walk <em>well walked.</em></h1>
              <p>Turn your daily dog walk into a free coffee, a treat, or a discount at participating local cafés and retailers — with goals tuned to keep your dog happy and healthy.</p>
              <div className="taglinebar">Walk <span>·</span> Earn <span>·</span> Treat</div>
              <div className="hero-cta">
                <a href={TESTING_URL} className="btn btn-berry">🐾 Join the testing community</a>
                <span className="hero-note">Launching soon on Google Play &amp; the App Store</span>
              </div>
              <div className="freebadge">Be one of our first walkers · Free for walkers, forever</div>
            </div>

            <div>
              <div className="phone">
                <div className="phone-top">
                  <span className="ptitle">Today&apos;s walk</span>
                  <span className="dot">● Active</span>
                </div>
                <svg width="100%" viewBox="0 0 260 80">
                  <path d="M10 62 C50 62 46 26 95 28 C150 30 145 56 188 54 C220 52 226 30 248 24" fill="none" stroke="#16B8A6" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
                  <circle cx="248" cy="24" r="6" fill="#FF7AAE" />
                </svg>
                <div className="stat-row">
                  <div className="stat" style={{ background: "var(--mint)" }}>
                    <div className="n" style={{ color: "var(--teal-dark)" }}>2.4<span style={{ fontSize: "12px" }}>km</span></div>
                    <div className="l" style={{ color: "var(--teal-dark)" }}>Distance</div>
                  </div>
                  <div className="stat" style={{ background: "#FFE9F1" }}>
                    <div className="n" style={{ color: "var(--berry-dark)" }}>+1</div>
                    <div className="l" style={{ color: "var(--berry-dark)" }}>Point earned</div>
                  </div>
                  <div className="stat" style={{ background: "#FFF6DD" }}>
                    <div className="n" style={{ color: "var(--gold-dark)" }}>28<span style={{ fontSize: "12px" }}>m</span></div>
                    <div className="l" style={{ color: "var(--gold-dark)" }}>Time</div>
                  </div>
                </div>
                <div className="goal"><span>Hugo&apos;s goal · Golden Retriever</span><b>86%</b></div>
              </div>
            </div>
          </div>

          {/* mascot trotting band */}
          <div className="trailband">
            <svg width="100%" viewBox="0 0 1100 130" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, height: "100%" }}>
              <path d="M0 110 C160 110 150 60 320 62 C500 64 480 96 660 94 C840 92 850 56 1000 54 L1100 52" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="3.5" strokeDasharray="2 10" strokeLinecap="round" />
              <g style={{ transformOrigin: "1040px 52px", animation: "rewardpulse 2.2s ease-in-out infinite" }}>
                <circle cx="1040" cy="52" r="16" fill="var(--gold)" />
                <text x="1040" y="58" textAnchor="middle" fontSize="17" fill="#4a3500">★</text>
              </g>
            </svg>

            <svg className="mascot" width="100" height="100" viewBox="0 0 120 120" aria-hidden="true">
              <ellipse cx="60" cy="105" rx="30" ry="5" fill="rgba(0,0,0,.18)" />
              <g style={{ transformOrigin: "60px 70px", animation: "bob .45s ease-in-out infinite" }}>
                <path d="M33 57 C19 57 8 47 8 35 C17 40 25 48 37 53 Z" fill="#E8A44E" style={{ transformOrigin: "33px 56px", animation: "wag .6s ease-in-out infinite" }} />
                <rect x="40" y="74" width="7" height="22" rx="3.5" fill="#D98F3C" style={{ transformOrigin: "43px 74px", animation: "legBack .45s ease-in-out infinite" }} />
                <rect x="74" y="74" width="7" height="22" rx="3.5" fill="#D98F3C" style={{ transformOrigin: "77px 74px", animation: "legBack .45s ease-in-out infinite reverse" }} />
                <ellipse cx="58" cy="64" rx="30" ry="20" fill="#F2B45C" />
                <path d="M30 60 Q26 78 34 84 Q40 76 40 66 Z" fill="#E8A44E" />
                <rect x="34" y="76" width="7" height="22" rx="3.5" fill="#F2B45C" style={{ transformOrigin: "37px 76px", animation: "legFront .45s ease-in-out infinite" }} />
                <rect x="70" y="76" width="7" height="22" rx="3.5" fill="#F2B45C" style={{ transformOrigin: "73px 76px", animation: "legFront .45s ease-in-out infinite reverse" }} />
                <g style={{ transformOrigin: "86px 50px", animation: "head .9s ease-in-out infinite" }}>
                  <ellipse cx="90" cy="48" rx="17" ry="15" fill="#F7C06E" />
                  <path d="M78 36 Q70 30 74 48 Q80 46 82 40 Z" fill="#E8A44E" />
                  <path d="M101 38 Q104 50 99 52 Q96 46 97 40 Z" fill="#E8A44E" />
                  <ellipse cx="104" cy="52" rx="8" ry="6" fill="#FAD08C" />
                  <circle cx="108" cy="51" r="2.6" fill="#3A2613" />
                  <circle cx="92" cy="46" r="2.4" fill="#3A2613" />
                  <circle cx="92.8" cy="45.2" r=".7" fill="#fff" />
                  <path d="M101 55 Q104 58 100 59" fill="none" stroke="#A85F28" strokeWidth="1.4" strokeLinecap="round" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">🐾 Three simple steps</span>
            <h2>How it works</h2>
            <p>No complicated setup, no catch. Just walk your dog and enjoy the rewards.</p>
          </div>
          <div className="steps">
            <div className="step">
              <span className="stepnum">01</span>
              <div className="ic" style={{ background: "var(--mint)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A6B60" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              </div>
              <h3>Enjoy your walk</h3>
              <p>Tap &apos;Start&apos; before you head out the door, then just enjoy the walk. When you&apos;re back, snap a photo of one happy, tired dog. That&apos;s it.</p>
              <p style={{ fontSize: "13px", color: "#9aa8a5", marginTop: "10px" }}>Walks are distance-checked automatically, so every step counts toward your dog&apos;s goal.</p>
            </div>
            <div className="step">
              <span className="stepnum">02</span>
              <div className="ic" style={{ background: "#FFE9F1" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C7406F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-2 5 5 0 0 1 9 2c-2 4.5-9 9-9 9z" /></svg>
              </div>
              <h3>Earn fairly</h3>
              <p>Every walk moves you toward a reward, with goals matched to your dog&apos;s breed and build — so effort counts, not size.</p>
            </div>
            <div className="step">
              <span className="stepnum">03</span>
              <div className="ic" style={{ background: "#FFF6DD" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B5841A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>
              </div>
              <h3>Treat yourself</h3>
              <p>Show your 4-digit code at any partner café or retailer in town for a coffee, a bite to eat, or a discount. A little reward for a walk well done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY TRUST BAND */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div style={{ background: "var(--cloud)", borderRadius: "var(--r-lg)", padding: "32px 40px", display: "flex", alignItems: "center", gap: "20px", justifyContent: "center", textAlign: "center", flexWrap: "wrap" }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0A6B60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
            <p style={{ maxWidth: "680px", fontSize: "15.5px", color: "var(--teal-dark)", margin: 0 }}><b style={{ color: "var(--teal-deep)" }}>Your privacy comes first.</b> We use location only to measure how far you&apos;ve walked — never where you go, never shared — and we delete it the moment the distance is counted.</p>
          </div>
        </div>
      </section>

      {/* FAIR-PAW */}
      <section id="fair">
        <div className="wrap">
          <div className="fair">
            <div className="fair-grid">
              <div className="fair-copy">
                <span className="eyebrow">⚖️ Our difference</span>
                <h2>Fair-Paw goals — every dog earns equally</h2>
                <p>Most apps reward raw distance, which isn&apos;t fair on smaller dogs. We tune each dog&apos;s goal to their breed and build.</p>
                <p>A Chihuahua reaching their target earns exactly what a Labrador earns reaching theirs. Because a good walk is about effort, not size — and it keeps every dog healthy.</p>
                <a href="#get" className="btn btn-ghost">See how goals are set →</a>
              </div>
              <div className="fair-vis">
                <div className="dogcard">
                  <svg width="46" height="46" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="#FFE9F1" /><ellipse cx="30" cy="34" rx="14" ry="11" fill="#F2B45C" /><circle cx="30" cy="24" r="11" fill="#F7C06E" /><circle cx="26" cy="23" r="1.6" fill="#3A2613" /><circle cx="34" cy="23" r="1.6" fill="#3A2613" /></svg>
                  <div className="meta">
                    <div className="nm">Pippa · Chihuahua</div>
                    <div className="br">1.5 km · 25 min · goal met</div>
                    <div className="bar"><i style={{ width: "100%" }} /></div>
                  </div>
                  <span className="same">+1</span>
                </div>
                <div className="dogcard">
                  <svg width="46" height="46" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="var(--mint)" /><ellipse cx="30" cy="34" rx="16" ry="12" fill="#E8C887" /><circle cx="30" cy="22" r="12" fill="#F2D89B" /><path d="M19 19 Q15 24 19 30 Q22 26 23 21 Z" fill="#D9B86A" /><path d="M41 19 Q45 24 41 30 Q38 26 37 21 Z" fill="#D9B86A" /><circle cx="26" cy="21" r="1.6" fill="#2C2C2A" /><circle cx="34" cy="21" r="1.6" fill="#2C2C2A" /><ellipse cx="30" cy="25" rx="2" ry="1.5" fill="#2C2C2A" /></svg>
                  <div className="meta">
                    <div className="nm">Rufus · Labrador</div>
                    <div className="br">5.0 km · 65 min · goal met</div>
                    <div className="bar"><i style={{ width: "100%" }} /></div>
                  </div>
                  <span className="same">+1</span>
                </div>
                <p style={{ textAlign: "center", color: "var(--teal-dark)", fontWeight: 600, fontSize: "14px" }}>Different effort → same reward 🐾</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HUGO GALLERY */}
      <section id="gallery" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">📸 Real walks, real dogs</span>
            <h2>Meet the PawPoints pack</h2>
            <p>Led by Hugo &amp; Daisy, our golden retriever mascots. These are real walks, straight from the app — bright, happy, out on the walk. They&apos;re the PawPoints creator&apos;s fur babies, having a ruff walk in the name of dogs&apos; health 🐶</p>
          </div>
          <div className="gallery">
            {mascots.length > 0 ? (
              mascots.map((m) => (
                <figure key={m.id} className="gphoto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.url}
                    alt={`${m.dogName || "A PawPoints dog"} out on a walk`}
                    className="ph"
                    style={{ objectFit: "cover", border: "none", padding: 0 }}
                  />
                  <figcaption className="gdate">
                    {m.dogName ? `${m.dogName} · ` : ""}{formatGalleryDate(m.createdAt)}
                  </figcaption>
                </figure>
              ))
            ) : (
              <>
                <div className="ph">Hugo mid-trot in the park<br />(photo coming)</div>
                <div className="ph">Daisy at a partner café<br />(photo coming)</div>
                <div className="ph">One happy tired dog<br />(photo coming)</div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners">
        <div className="wrap">
          <div className="partners">
            <div className="partners-grid">
              <div>
                <span className="eyebrow">🏪 For cafés &amp; retailers</span>
                <h2>Welcome a loving community to your door</h2>
                <p>Turn local dog walkers into loyal regulars. Join the PawPoints family and connect with your town&apos;s growing community of dog owners.</p>
                <div className="pcheck"><span className="tick">✓</span><span>Zero setup costs and your first month entirely free</span></div>
                <div className="pcheck"><span className="tick">✓</span><span>Turnkey loyalty — we handle the tracking behind the scenes</span></div>
                <div className="pcheck"><span className="tick">✓</span><span>Your team just verifies a 4-digit code at the till</span></div>
                <a href="mailto:support@pawpoints.co.nz?subject=Partnership%20enquiry" className="btn btn-white" style={{ marginTop: "10px" }}>Become a partner →</a>
              </div>
              <div className="till">
                <div className="h">Verify a reward at the till</div>
                <div className="code"><span>4</span><span>2</span><span>9</span><span>7</span></div>
                <button className="verify">Verify code</button>
                <p style={{ fontSize: "12.5px", color: "var(--slate)", textAlign: "center", marginTop: "12px" }}>That&apos;s all your staff need to do.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="get" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="final">
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginBottom: "22px" }}>
              <span style={{ animation: "pawpop 2.4s ease-in-out infinite" }}><PawLogo size={38} pink="#FF7AAE" white="#16B8A6" /></span>
              <span style={{ animation: "pawpop 2.4s ease-in-out infinite .4s" }}><PawLogo size={38} pink="#FF7AAE" white="#16B8A6" /></span>
              <span style={{ animation: "pawpop 2.4s ease-in-out infinite .8s" }}><PawLogo size={38} pink="#FF7AAE" white="#16B8A6" /></span>
            </div>
            <h2>Ready to step out together?</h2>
            <p>We&apos;re opening up early access before our public launch on Google Play and the App Store. Join our testing community to be one of the first walkers — and help shape PawPoints. Ask your favourite café or retailer to join us too.</p>
            <a href={TESTING_URL} className="btn btn-berry">🐾 Join the testing community</a>
            <p style={{ fontSize: "14px", marginTop: "16px", color: "rgba(255,255,255,.7)" }}>Coming to Wellington &amp; Christchurch in early 2027 🐾</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <a className="logo" href="#top" style={{ color: "var(--teal-dark)" }}>
              <PawLogo size={26} pink="#FF7AAE" white="#16B8A6" />
              PawPoints
            </a>
            <div className="foot-links">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <a href="mailto:support@pawpoints.co.nz">support@pawpoints.co.nz</a>
            </div>
          </div>
          <p className="copy" style={{ marginTop: "18px" }}>© 2026 PawPoints · Made in Auckland, NZ 🇳🇿</p>
        </div>
      </footer>
    </div>
  );
}
