"use client";

import { useEffect, useRef } from "react";

/**
 * Evidence Orbit — the animated hero visual.
 *
 * Evidence "records" orbit the program core, periodically drop inward, get
 * verified as they cross the mid ring, and are absorbed into the core — raising
 * the fill level and the report-completion counter. Illustrates that proof is
 * captured continuously while the program runs.
 */

const ICONS: Record<string, string> = {
  mic: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4"/></svg>',
  doc: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  phone: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  note: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
  case: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
  grad: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>',
};

const CHECK =
  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

const KINDS = [
  { ic: "mic", label: "Mock interview" },
  { ic: "doc", label: "Resume revised" },
  { ic: "phone", label: "Voice check-in" },
  { ic: "note", label: "Case note" },
  { ic: "case", label: "Employer contact" },
  { ic: "grad", label: "Credential earned" },
] as const;

type OrbitNode = {
  el: HTMLDivElement;
  angle: number;
  r: number;
  drift: number;
  bobPhase: number;
  v: number;
  state: "orbit" | "drop";
  verified: boolean;
  sinking: boolean;
  opacity: number;
};

export default function EvidenceOrbit() {
  const stageRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const fillEl = fillRef.current;
    const pctEl = pctRef.current;
    const cntEl = countRef.current;
    const statusEl = statusRef.current;
    const pulseEl = pulseRef.current;
    if (!stage || !fillEl || !pctEl || !cntEl || !statusEl || !pulseEl) return;

    let CX = 0;
    let CY = 0;
    let R_OUT = 260;
    let R_MID = 174;
    let R_CORE = 100;

    const measure = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      CX = w / 2;
      CY = h / 2;
      const small = window.innerWidth <= 920;
      R_OUT = small ? 230 : 260;
      R_MID = small ? 155 : 174;
      R_CORE = small ? 90 : 100;
    };
    measure();
    window.addEventListener("resize", measure);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let records = 1247;
    let pct = 53;
    const nodes: OrbitNode[] = [];
    let kindIdx = 0;

    const setFill = () => {
      fillEl.style.height = pct + "%";
    };
    setFill();

    const makeNode = (angle: number): OrbitNode => {
      const kind = KINDS[kindIdx % KINDS.length];
      kindIdx++;
      const el = document.createElement("div");
      el.className = "eo-node";
      el.innerHTML =
        '<span class="eo-ic">' +
        ICONS[kind.ic] +
        '</span><span class="eo-nt">' +
        kind.label +
        '</span><span class="eo-vk">' +
        CHECK +
        "</span>";
      el.style.opacity = "0";
      stage.appendChild(el);
      const node: OrbitNode = {
        el,
        angle,
        r: R_OUT,
        drift: (Math.random() < 0.5 ? -1 : 1) * (0.00006 + Math.random() * 0.00005),
        bobPhase: Math.random() * Math.PI * 2,
        v: 0,
        state: "orbit",
        verified: false,
        sinking: false,
        opacity: 0,
      };
      nodes.push(node);
      return node;
    };

    const START = 5;
    for (let i = 0; i < START; i++) {
      makeNode((Math.PI * 2 / START) * i + 0.5);
    }

    let raf = 0;
    let last = performance.now();
    let dropTimer = 3200;
    const G = 0.00042;
    const absorbTimers: ReturnType<typeof setTimeout>[] = [];

    const absorb = (node: OrbitNode) => {
      node.el.remove();
      const idx = nodes.indexOf(node);
      if (idx > -1) nodes.splice(idx, 1);
      records++;
      cntEl.textContent = records.toLocaleString();
      if (pct < 100) {
        pct++;
        pctEl.textContent = String(pct);
        setFill();
      }
      if (pct >= 100) {
        statusEl.textContent = "Ready";
        statusEl.classList.add("ready");
      }
      pulseEl.classList.remove("go");
      void pulseEl.offsetWidth;
      pulseEl.classList.add("go");
      const gap = Math.random() * Math.PI * 2;
      absorbTimers.push(setTimeout(() => makeNode(gap), 1100));
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      dropTimer += dt;

      if (dropTimer > 4200) {
        dropTimer = 0;
        const candidates = nodes.filter((n) => n.state === "orbit" && n.opacity > 0.9);
        if (candidates.length > 2) {
          const pick = candidates[Math.floor(Math.random() * candidates.length)];
          pick.state = "drop";
          pick.v = 0.015;
        }
      }

      for (const n of nodes) {
        if (n.opacity < 1 && n.state === "orbit") {
          n.opacity = Math.min(1, n.opacity + dt / 600);
          n.el.style.opacity = String(n.opacity);
        }

        let r = n.r;
        if (n.state === "orbit") {
          n.angle += n.drift * dt;
          n.bobPhase += dt * 0.0012;
          r = n.r + Math.sin(n.bobPhase) * 5;
        } else {
          n.v += G * dt;
          n.r -= n.v * dt;
          r = n.r;
          if (!n.verified && n.r <= R_MID) {
            n.verified = true;
            n.el.classList.add("verified");
          }
          if (n.r <= R_CORE + 48) {
            if (!n.sinking) {
              n.sinking = true;
              n.el.style.zIndex = "2";
            }
            n.opacity = Math.max(0, n.opacity - dt / 240);
            n.el.style.opacity = String(n.opacity);
            if (n.opacity <= 0) {
              absorb(n);
              continue;
            }
          }
        }

        const x = CX + r * Math.cos(n.angle);
        const y = CY + r * Math.sin(n.angle) * 0.92;
        n.el.style.transform =
          "translate(" +
          (x - n.el.offsetWidth / 2) +
          "px," +
          (y - n.el.offsetHeight / 2) +
          "px)";
      }
      raf = requestAnimationFrame(frame);
    };

    if (reduceMotion) {
      nodes.forEach((n) => {
        n.opacity = 1;
        n.el.style.opacity = "1";
        const x = CX + n.r * Math.cos(n.angle);
        const y = CY + n.r * Math.sin(n.angle) * 0.92;
        n.el.style.transform = "translate(" + (x - 60) + "px," + (y - 16) + "px)";
      });
    } else {
      raf = requestAnimationFrame(frame);
      absorbTimers.push(
        setTimeout(() => {
          const first = nodes.find((n) => n.state === "orbit");
          if (first) {
            first.state = "drop";
            first.v = 0.015;
            first.opacity = 1;
            first.el.style.opacity = "1";
          }
        }, 900),
      );
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      absorbTimers.forEach(clearTimeout);
      nodes.forEach((n) => n.el.remove());
      nodes.length = 0;
    };
  }, []);

  return (
    <div className="eo-root">
      <div className="eo-label">Your program, running as usual</div>
      <div className="eo-wrap" ref={stageRef}>
        <div className="eo-ring eo-ring-outer" />
        <div className="eo-ring eo-ring-mid" />
        <span className="eo-ring-tag eo-tag-mid">Captured &amp; verified</span>
        <div className="eo-pulse" ref={pulseRef} />
        <div className="eo-core">
          <div className="eo-fill" ref={fillRef} />
          <div className="eo-core-text">
            <div className="eo-ct">Q3 report</div>
            <div className="eo-cp">
              <span ref={pctRef}>53</span>%
            </div>
            <div className="eo-cr">
              <span ref={countRef}>1,247</span> evidence records
            </div>
            <div className="eo-badge" ref={statusRef}>
              Building
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .eo-root {
          --navy: #102c64;
          --navy-dark: #0b1f49;
          --navy-muted: #5b7393;
          --coral: #fe686d;
          --ice: #b8ccf4;
          --bg: #f8fafe;
          --line: #e3e9f4;
          --green: #1d9e75;
          --green-bg: #e4f6ef;
          --green-dark: #0f6e56;
          --amber: #b57b12;
          --amber-bg: #fbf0da;
          --water: #2e5aa8;
          --water-hi: #3e6dc0;
          position: relative;
          width: 100%;
        }
        .eo-label {
          text-align: center;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--navy-muted);
          margin-bottom: 10px;
        }
        .eo-wrap {
          position: relative;
          width: 100%;
          max-width: 620px;
          height: 580px;
          margin: 0 auto;
        }
        .eo-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          pointer-events: none;
        }
        .eo-ring-outer {
          width: 520px;
          height: 520px;
          border: 1.5px dashed #d4def0;
        }
        .eo-ring-mid {
          width: 348px;
          height: 348px;
          border: 1.5px dashed #c3d2ec;
        }
        .eo-ring-tag {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--navy-muted);
          background: var(--bg);
          padding: 2px 10px;
          white-space: nowrap;
          z-index: 6;
          border-radius: 12px;
        }
        .eo-tag-mid {
          top: 120px;
          color: var(--green-dark);
        }
        .eo-core {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: var(--navy-dark);
          overflow: hidden;
          box-shadow: 0 24px 70px rgba(16, 44, 100, 0.32);
          z-index: 3;
        }
        .eo-fill {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 53%;
          background: var(--water);
          transition: height 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .eo-fill::before {
          content: "";
          position: absolute;
          top: -13px;
          left: -30%;
          width: 160%;
          height: 26px;
          background: var(--water);
          border-radius: 46%;
          animation: eo-slosh 5.5s ease-in-out infinite;
        }
        .eo-fill::after {
          content: "";
          position: absolute;
          top: -9px;
          left: -20%;
          width: 140%;
          height: 20px;
          background: var(--water-hi);
          opacity: 0.5;
          border-radius: 44%;
          animation: eo-slosh 4.2s ease-in-out infinite reverse;
        }
        @keyframes eo-slosh {
          0%,
          100% {
            transform: translateX(-14px) rotate(-1.5deg);
          }
          50% {
            transform: translateX(14px) rotate(1.5deg);
          }
        }
        .eo-core-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #fff;
          z-index: 2;
        }
        .eo-ct {
          font-size: 12px;
          font-weight: 600;
          opacity: 0.78;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .eo-cp {
          font-size: 40px;
          font-weight: 700;
          line-height: 1;
        }
        .eo-cr {
          font-size: 12.5px;
          opacity: 0.82;
          margin-top: 5px;
        }
        .eo-badge {
          margin-top: 9px;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 12px;
          border-radius: 20px;
          background: var(--amber-bg);
          color: var(--amber);
          transition: all 0.4s ease;
        }
        .eo-badge.ready {
          background: var(--green-bg);
          color: var(--green-dark);
        }
        .eo-pulse {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 2px solid var(--coral);
          transform: translate(-50%, -50%);
          opacity: 0;
          pointer-events: none;
          z-index: 2;
        }
        .eo-pulse.go {
          animation: eo-pulse 0.9s ease-out;
        }
        @keyframes eo-pulse {
          0% {
            opacity: 0.7;
            width: 200px;
            height: 200px;
          }
          100% {
            opacity: 0;
            width: 320px;
            height: 320px;
          }
        }
        @media (max-width: 920px) {
          .eo-wrap {
            height: 520px;
            max-width: 520px;
          }
          .eo-ring-outer {
            width: 460px;
            height: 460px;
          }
          .eo-ring-mid {
            width: 310px;
            height: 310px;
          }
          .eo-tag-mid {
            top: 112px;
          }
          .eo-core {
            width: 180px;
            height: 180px;
          }
          .eo-cp {
            font-size: 34px;
          }
          .eo-pulse {
            width: 180px;
            height: 180px;
          }
        }
      `}</style>

      {/* Node styling — global because nodes are created imperatively */}
      <style jsx global>{`
        .eo-node {
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          gap: 7px;
          align-items: center;
          background: #fff;
          border: 1px solid #e3e9f4;
          border-radius: 24px;
          padding: 6px 12px 6px 7px;
          box-shadow: 0 6px 20px rgba(16, 44, 100, 0.1);
          white-space: nowrap;
          z-index: 4;
          will-change: transform;
        }
        .eo-node .eo-ic {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #eaf0fb;
          color: #102c64;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .eo-node .eo-nt {
          font-size: 12px;
          font-weight: 600;
          color: #102c64;
        }
        .eo-node .eo-vk {
          display: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #1d9e75;
          color: #fff;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .eo-node.verified {
          border-color: #1d9e75;
        }
        .eo-node.verified .eo-vk {
          display: flex;
        }
        @media (max-width: 920px) {
          .eo-node .eo-nt {
            font-size: 11.5px;
          }
        }
      `}</style>
    </div>
  );
}
