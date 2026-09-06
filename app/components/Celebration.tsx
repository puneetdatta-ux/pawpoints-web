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
          0%, 100% { transform: rotate(-12deg) translateY(0); }
          25% { transform: rotate(8deg) translateY(-16px); }
          50% { transform: rotate(-8deg) translateY(0); }
          75% { transform: rotate(12deg) translateY(-12px); }
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

      {/* Dancing pup + bone party */}
      <div style={{ position: "absolute", bottom: "6vh", left: 0, right: 0, textAlign: "center" }}>
        <div style={{ display: "inline-block", fontSize: 72, animation: "pp-dance 1.2s ease-in-out infinite" }}>
          🐶
        </div>
        <div
          style={{
            margin: "6px auto 0",
            width: 70,
            height: 10,
            borderRadius: "50%",
            background: "#0A6B60",
            animation: "pp-shadow 1.2s ease-in-out infinite",
          }}
        />
        <div style={{ fontSize: 22, marginTop: 4 }}>🦴 🎉 🦴</div>
      </div>
    </div>
  );
}
