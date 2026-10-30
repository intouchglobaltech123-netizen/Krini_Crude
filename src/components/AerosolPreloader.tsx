"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Premium Aerosol Spray Preloader for KRINI CRUDE
 * 
 * Animation Sequence (~2.5s total):
 * 1. Clean full-screen white background on initial render.
 * 2. Realistic industrial silver aerosol can appears in view with subtle tilt.
 * 3. Actuator nozzle depresses; releases fine lubricant mist with spray physics
 *    (velocity, cone dispersion, air drag, radial droplet expansion, gold lubricant tints).
 * 4. Spray mist expands across viewport to form a smooth volumetric transition.
 * 5. The mist clears and disperses seamlessly to reveal the approved KRINI CRUDE homepage.
 * 
 * Safe unmounting, responsive positioning, and zero layout interference.
 */
export function AerosolPreloader() {
  const [phase, setPhase] = useState<"enter" | "spraying" | "disperse" | "done">("enter");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canContainerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if test preview mode is requested via URL (?preloader=spray)
    const isSprayPreview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preloader") === "spray";
    if (isSprayPreview) {
      setPhase("spraying");
      return;
    }

    // Failsafe timer: Ensure preloader NEVER blocks website under any circumstances
    const failsafeTimer = setTimeout(() => {
      setPhase("done");
    }, 3200);

    // Timeline phases:
    // 0ms: can slides in
    // 380ms: nozzle triggers realistic spray burst
    const sprayTimer = setTimeout(() => {
      setPhase("spraying");
    }, 380);

    // 1800ms: spray stops, fine mist expands and disperses
    const disperseTimer = setTimeout(() => {
      setPhase("disperse");
    }, 1800);

    // 2550ms: animation complete, component unmounts cleanly
    const finishTimer = setTimeout(() => {
      setPhase("done");
    }, 2550);

    return () => {
      clearTimeout(failsafeTimer);
      clearTimeout(sprayTimer);
      clearTimeout(disperseTimer);
      clearTimeout(finishTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Photorealistic spray particle physics simulation
  useEffect(() => {
    if (phase === "done") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      growth: number;
      alpha: number;
      decay: number;
      tint: "gold" | "bright" | "vapor";
      rotation: number;
      vRot: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 400;
    const startTime = performance.now();

    const loop = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const isSprayPreview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preloader") === "spray";
      const isSpraying = isSprayPreview || (elapsed >= 380 && elapsed <= 1750);

      // Clear canvas each frame
      ctx.clearRect(0, 0, width, height);

      // Determine nozzle origin accurately from the can's DOM position
      let originX = width * 0.18;
      let originY = height * 0.6;

      if (canContainerRef.current) {
        const rect = canContainerRef.current.getBoundingClientRect();
        // SVG viewBox: 200x460. Nozzle orifice is at x=123 (61.5%), y=24 (5.2%)
        originX = rect.left + rect.width * 0.615;
        originY = rect.top + rect.height * 0.052;
      }

      // Draw continuous high-speed conical jet plume when spraying
      if (isSpraying) {
        const jetAngle = -0.27; // ~15.5 deg upward
        const jetLen = width < 768 ? 200 : 320;
        const p1X = originX + Math.cos(jetAngle - 0.16) * jetLen;
        const p1Y = originY + Math.sin(jetAngle - 0.16) * jetLen;
        const p2X = originX + Math.cos(jetAngle + 0.16) * jetLen;
        const p2Y = originY + Math.sin(jetAngle + 0.16) * jetLen;

        ctx.save();
        // High-velocity expanding mist cone
        const coneGrad = ctx.createLinearGradient(originX, originY, (p1X + p2X) / 2, (p1Y + p2Y) / 2);
        coneGrad.addColorStop(0, "rgba(255, 193, 7, 0.75)");
        coneGrad.addColorStop(0.18, "rgba(255, 202, 40, 0.45)");
        coneGrad.addColorStop(0.55, "rgba(255, 213, 79, 0.16)");
        coneGrad.addColorStop(1, "rgba(255, 250, 235, 0)");

        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(p1X, p1Y);
        ctx.lineTo(p2X, p2Y);
        ctx.closePath();
        ctx.fill();

        // Secondary soft atomization bloom around the nozzle exit
        const nozzleBloom = ctx.createRadialGradient(originX, originY, 0, originX, originY, 50);
        nozzleBloom.addColorStop(0, "rgba(255, 202, 40, 0.5)");
        nozzleBloom.addColorStop(0.5, "rgba(255, 213, 79, 0.2)");
        nozzleBloom.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = nozzleBloom;
        ctx.beginPath();
        ctx.arc(originX, originY, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Spawn fine atomized mist droplets
        const spawnCount = width < 768 ? 22 : 38;
        for (let i = 0; i < spawnCount; i++) {
          if (particles.length >= maxParticles) break;

          // Natural aerosol cone: directed ~15.5 degrees upward to the right with fluid spread
          const spread = (Math.random() - 0.48) * 0.52;
          const angle = jetAngle + spread;

          // High initial ejection velocity carrying mist across viewport
          const speed = (width < 768 ? 32 : 48) + Math.random() * 44;
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed;

          // Lubricant spray palette:
          // 50% luminous golden amber lubricant droplets
          // 25% warm amber glints
          // 25% fine atomized vapor mist
          const rand = Math.random();
          const tint: "gold" | "bright" | "vapor" = rand < 0.5 ? "gold" : rand < 0.75 ? "bright" : "vapor";

          particles.push({
            x: originX + (Math.random() - 0.5) * 4,
            y: originY + (Math.random() - 0.5) * 4,
            vx,
            vy,
            size: 1.0 + Math.random() * 2.2,
            growth: 0.9 + Math.random() * 1.8,
            alpha: 0.65 + Math.random() * 0.25,
            decay: 0.005 + Math.random() * 0.007,
            tint,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.08,
          });
        }
      }

      // Update & render particles with air drag and radial volumetric expansion
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Atmospheric drag decelerates spray droplets into suspended mist
        p.vx *= 0.962;
        p.vy *= 0.962;

        // Micro buoyant upward drift and subtle eddy turbulence
        p.vy -= 0.08;
        p.vx += Math.sin(p.y * 0.018 + elapsed * 0.003) * 0.35;

        p.x += p.vx;
        p.y += p.vy;
        p.size += p.growth;
        p.alpha -= p.decay;
        p.rotation += p.vRot;

        if (p.alpha <= 0 || p.x > width + 250 || p.y < -250 || p.y > height + 250) {
          particles.splice(i, 1);
          continue;
        }

        // Draw soft volumetric atomized mist droplet
        const rad = Math.max(0.8, p.size);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);

        if (p.tint === "gold") {
          // Luminous amber/yellow lubricant highlight
          grad.addColorStop(0, `rgba(255, 193, 7, ${p.alpha * 0.65})`);
          grad.addColorStop(0.4, `rgba(255, 202, 40, ${p.alpha * 0.38})`);
          grad.addColorStop(0.8, `rgba(255, 213, 79, ${p.alpha * 0.12})`);
          grad.addColorStop(1, "rgba(255, 245, 180, 0)");
        } else if (p.tint === "bright") {
          // Warm amber glint
          grad.addColorStop(0, `rgba(255, 193, 7, ${p.alpha * 0.6})`);
          grad.addColorStop(0.5, `rgba(255, 213, 79, ${p.alpha * 0.28})`);
          grad.addColorStop(1, "rgba(255, 250, 210, 0)");
        } else {
          // Fine lubricant vapor mist with warm atmospheric refraction
          grad.addColorStop(0, `rgba(215, 205, 185, ${p.alpha * 0.35})`);
          grad.addColorStop(0.5, `rgba(238, 230, 215, ${p.alpha * 0.18})`);
          grad.addColorStop(0.85, `rgba(248, 244, 235, ${p.alpha * 0.08})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // (this effect only runs while the phase isn't "done"; the cleanup stops the loop)
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase]);

  // Clean unmount once animation is complete
  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999999] pointer-events-none flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        phase === "disperse" ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "#FFFFFF",
      }}
      aria-hidden="true"
    >
      {/* Background Volumetric Mist Expansion Layer */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-out ${
          phase === "spraying"
            ? "opacity-90 scale-100"
            : phase === "disperse"
            ? "opacity-0 scale-105"
            : "opacity-0 scale-95"
        }`}
        style={{
          background:
            "radial-gradient(circle at 45% 50%, rgba(255, 255, 255, 0.98) 0%, rgba(248, 246, 238, 0.9) 35%, rgba(238, 228, 205, 0.65) 65%, rgba(255, 255, 255, 0.95) 100%)",
          filter: "blur(24px)",
        }}
      />

      {/* Physics Canvas for High-Speed Aerosol Spray */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* Realistic Industrial Silver Aerosol Can */}
      <div
        ref={canContainerRef}
        className={`absolute z-20 transition-all duration-700 ease-out ${
          phase === "enter"
            ? "translate-x-[-70px] translate-y-[60px] opacity-0 rotate-[-12deg]"
            : phase === "spraying"
            ? "translate-x-0 translate-y-0 opacity-100 rotate-[-6deg]"
            : "translate-x-[-110px] translate-y-[90px] opacity-0 rotate-[-16deg]"
        }`}
        style={{
          left: "clamp(12px, 8vw, 110px)",
          bottom: "clamp(20px, 12vh, 130px)",
          width: "clamp(130px, 15vw, 185px)",
        }}
      >
        <svg
          viewBox="0 0 200 460"
          className="w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.16)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Brushed Silver Can Cylinder Gradient */}
            <linearGradient id="silverBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#81868f" />
              <stop offset="16%" stopColor="#b4b9c2" />
              <stop offset="38%" stopColor="#ffffff" />
              <stop offset="62%" stopColor="#d2d6dc" />
              <stop offset="85%" stopColor="#9da2ab" />
              <stop offset="100%" stopColor="#676b74" />
            </linearGradient>

            {/* Dome Shoulder Metallic Highlight */}
            <linearGradient id="silverDome" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6c7078" />
              <stop offset="20%" stopColor="#c5cad4" />
              <stop offset="45%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#9aa0ab" />
              <stop offset="100%" stopColor="#555861" />
            </linearGradient>

            {/* Actuator Nozzle Button Gradient */}
            <linearGradient id="actuatorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3a3d42" />
              <stop offset="30%" stopColor="#636873" />
              <stop offset="55%" stopColor="#9299a6" />
              <stop offset="80%" stopColor="#4a4e54" />
              <stop offset="100%" stopColor="#25272a" />
            </linearGradient>

            {/* Gold Brand Accent Stripe */}
            <linearGradient id="goldStripe" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffb300" />
              <stop offset="35%" stopColor="#ffd54f" />
              <stop offset="55%" stopColor="#ffc107" />
              <stop offset="85%" stopColor="#ffb300" />
              <stop offset="100%" stopColor="#ffa000" />
            </linearGradient>

            {/* Specular Highlight Streak */}
            <linearGradient id="specularLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
            </linearGradient>
          </defs>

          {/* Actuator Spray Button with depress animation during spray */}
          <g
            className={`transition-transform duration-150 ${
              phase === "spraying" ? "translate-y-[4px]" : "translate-y-0"
            }`}
          >
            {/* Actuator stem */}
            <rect x="91" y="44" width="18" height="18" rx="2" fill="url(#silverDome)" />

            {/* Button body */}
            <path
              d="M74 14C74 9.58 77.58 6 82 6H118C122.42 6 126 9.58 126 14V46C126 47.1 125.1 48 124 48H76C74.9 48 74 47.1 74 46V14Z"
              fill="url(#actuatorGrad)"
            />

            {/* Finger contour indentation */}
            <path
              d="M80 12C88 8 112 8 120 12"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Spray Nozzle Orifice facing upper right */}
            <ellipse cx="123" cy="24" rx="3.5" ry="5.5" fill="#111215" stroke="#ffc107" strokeWidth="1.2" />
            <circle cx="123" cy="24" r="1.5" fill="#ffd54f" />

            {/* Active Spray Nozzle Glow when firing */}
            {phase === "spraying" && (
              <circle
                cx="126"
                cy="24"
                r="7"
                fill="rgba(255, 193, 7, 0.45)"
                className="animate-pulse"
              />
            )}
          </g>

          {/* Valve Mounting Collar */}
          <path
            d="M66 54C66 51 68 49 71 49H129C132 49 134 51 134 54V62H66V54Z"
            fill="url(#silverDome)"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1"
          />
          <ellipse cx="100" cy="62" rx="34" ry="4" fill="#4d5057" />

          {/* Can Dome Shoulder */}
          <path
            d="M36 105C36 78 62 62 100 62C138 62 164 78 164 105V114H36V105Z"
            fill="url(#silverDome)"
          />

          {/* Double Seam Neck Ring */}
          <rect x="33" y="112" width="134" height="6" rx="2" fill="#585c64" />
          <rect x="33" y="113" width="134" height="2" fill="rgba(255,255,255,0.55)" />

          {/* Main Can Cylinder Body */}
          <rect x="35" y="118" width="130" height="305" rx="4" fill="url(#silverBody)" />

          {/* Specular Highlight Streak */}
          <rect
            x="80"
            y="118"
            width="22"
            height="305"
            fill="url(#specularLine)"
            opacity="0.65"
          />

          {/* Krini Gold Accent Brand Band */}
          <rect x="35" y="175" width="130" height="42" fill="url(#goldStripe)" />
          <rect x="35" y="175" width="130" height="2" fill="rgba(255,255,255,0.7)" />
          <rect x="35" y="215" width="130" height="2" fill="rgba(0,0,0,0.25)" />

          {/* Brand Typography */}
          <text
            x="100"
            y="202"
            textAnchor="middle"
            fill="#0C0B09"
            fontSize="18"
            fontWeight="800"
            letterSpacing="2.5"
            fontFamily="sans-serif"
          >
            KRINI
          </text>
          <text
            x="100"
            y="248"
            textAnchor="middle"
            fill="#181715"
            fontSize="11"
            fontWeight="700"
            letterSpacing="3"
            fontFamily="sans-serif"
          >
            AEROSOL
          </text>
          <text
            x="100"
            y="266"
            textAnchor="middle"
            fill="#5a5e66"
            fontSize="8"
            fontWeight="600"
            letterSpacing="1.8"
            fontFamily="monospace"
          >
            INDUSTRIAL GRADE
          </text>

          {/* Technical Spec Markings */}
          <line x1="60" y1="282" x2="140" y2="282" stroke="#a0a5ad" strokeWidth="0.8" />
          <text
            x="100"
            y="302"
            textAnchor="middle"
            fill="#71767f"
            fontSize="7"
            letterSpacing="1"
            fontFamily="monospace"
          >
            400 ML / 300 G
          </text>

          {/* Bottom Chime Rim */}
          <path
            d="M35 418C35 414 42 411 100 411C158 411 165 414 165 418V426C165 431 158 434 100 434C42 434 35 431 35 426V418Z"
            fill="url(#silverDome)"
          />
          <ellipse cx="100" cy="425" rx="63" ry="5" fill="#3e4147" />
        </svg>
      </div>

      {/* Subtle Ambient Vignette */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          phase === "spraying" ? "opacity-25" : "opacity-0"
        }`}
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(255, 193, 7, 0.08) 100%)",
        }}
      />
    </div>
  );
}
