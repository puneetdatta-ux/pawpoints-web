"use client";

// Full-screen celebration for sign-up success: confetti rain, firework
// bursts, and a dancing pup. Pure CSS — no libraries, pointer-events none
// so the card stays clickable.

const CONFETTI_COLORS = ["#16B8A6", "#FFCB47", "#FF7AAE", "#0A6B60", "#7a6ba8"];

export default function Celebration() {
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    left: (i * 61) % 100,
    delay: ((i * 37) % 40) / 10,
    duration: 4 + ((i * 13) % 30) / 10,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    spin: (i % 2 === 0 ? 1 : -1) * (200 + ((i * 29) % 300)),
    size: 6 + ((i * 7) % 8),
  }));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <style>{`
        @keyframes pp-confetti-fall {
          0% { transform: translateY(-6vh) rotate(0deg); opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(106vh) rotate(var(--pp-spin)); opacity: 0; }
        }
        @keyframes pp-firework {
          0% { transform: scale(0.1); opacity: 0; }
          8% { opacity: 1; }
          45% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes pp-dance {
          0%, 100% { transform: rotate(-6deg) translateY(0); }
          25% { transform: rotate(4deg) translateY(-14px); }
          50% { transform: rotate(-4deg) translateY(0); }
          75% { transform: rotate(6deg) translateY(-10px); }
        }
        @keyframes pp-shadow {
          0%, 50%, 100% { transform: scaleX(1); opacity: 0.18; }
          25%, 75% { transform: scaleX(0.75); opacity: 0.1; }
        }
      `}</style>

      {/* Confetti rain */}
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: "-4vh",
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.45,
            background: p.color,
            borderRadius: 2,
            animation: `pp-confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
            ["--pp-spin" as string]: `${p.spin}deg`,
          }}
        />
      ))}

      {/* Firework bursts */}
      {[
        { left: "14%", top: "22%", color: "#FFCB47", delay: "0s" },
        { left: "82%", top: "18%", color: "#FF7AAE", delay: "0.9s" },
        { left: "70%", top: "58%", color: "#16B8A6", delay: "1.7s" },
        { left: "22%", top: "62%", color: "#7a6ba8", delay: "2.4s" },
      ].map((f, i) => (
        <span
          key={`fw${i}`}
          style={{
            position: "absolute",
            left: f.left,
            top: f.top,
            width: 140,
            height: 140,
            marginLeft: -70,
            marginTop: -70,
            borderRadius: "50%",
            background: `radial-gradient(circle, transparent 30%, ${f.color} 31%, transparent 33%),
                         repeating-conic-gradient(${f.color} 0deg 4deg, transparent 4deg 30deg)`,
            WebkitMaskImage: "radial-gradient(circle, transparent 35%, black 36%, black 60%, transparent 61%)",
            maskImage: "radial-gradient(circle, transparent 35%, black 36%, black 60%, transparent 61%)",
            animation: `pp-firework 2.6s ease-out ${f.delay} infinite`,
          }}
        />
      ))}

      {/* Hugo the golden retriever (homepage mascot) doing a happy dance —
          wag/bob/leg keyframes come from globals.css; pp-dance adds the groove */}
      <div style={{ position: "absolute", bottom: "4vh", left: 0, right: 0, textAlign: "center" }}>
        <div style={{ display: "inline-block", animation: "pp-dance 1.6s ease-in-out infinite" }}>
          <svg width="150" height="150" viewBox="0 0 120 120" aria-hidden="true">
            <ellipse cx="60" cy="105" rx="30" ry="5" fill="rgba(0,0,0,.18)" />
            <g style={{ transformOrigin: "60px 70px", animation: "bob .45s ease-in-out infinite" }}>
              <path d="M33 57 C19 57 8 47 8 35 C17 40 25 48 37 53 Z" fill="#E8A44E" style={{ transformOrigin: "33px 56px", animation: "wag .3s ease-in-out infinite" }} />
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
        <div style={{ fontSize: 22, marginTop: 2 }}>🦴 🎉 🦴</div>
      </div>
    </div>
  );
}
