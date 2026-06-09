"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchMascotGallery, type MascotPhoto } from "../../lib/supabase";

function formatGalleryDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<MascotPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMascotGallery(200)
      .then(setPhotos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pp-home">
      <header>
        <div className="wrap">
          <nav>
            <Link className="logo" href="/">
              <span style={{ fontSize: 22 }}>🐾</span> PawPoints
            </Link>
            <div className="nav-links">
              <Link href="/">← Back home</Link>
            </div>
          </nav>
        </div>
      </header>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">📸 The whole pack</span>
            <h2>Hugo &amp; Daisy&apos;s walks</h2>
            <p>Every walk, straight from the app — bright, happy, out on the walk in the name of dogs&apos; health 🐶</p>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "var(--slate)" }}>Loading photos…</p>
          ) : photos.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--slate)" }}>No photos yet — check back soon!</p>
          ) : (
            <div className="gallery">
              {photos.map((m) => (
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
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link href="/" className="btn btn-ghost">← Back home</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <Link className="logo" href="/" style={{ color: "var(--teal-dark)" }}>
              <span style={{ fontSize: 20 }}>🐾</span> PawPoints
            </Link>
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
