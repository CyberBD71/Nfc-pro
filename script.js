/* ==========================================================================
   Md Imteaz Hashem Arfat — NFC Digital Business Card
   script.js — all interactivity, no frameworks
   ========================================================================== */

(() => {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* 1. SPLASH SCREEN                                                    */
  /* ------------------------------------------------------------------ */
  const splash = document.getElementById("splash");
  const splashProgress = document.getElementById("splashProgress");

  window.addEventListener("load", () => {
    // animate progress bar
    requestAnimationFrame(() => {
      splashProgress.style.width = "100%";
    });

    // hide splash once loaded (min display time for a premium feel)
    setTimeout(() => {
      splash.classList.add("is-hidden");
      document.body.style.overflow = "";
      startRevealObserver(); // start scroll reveals only once splash is gone
    }, 1500);
  });

  // Prevent body scroll while splash is visible
  document.body.style.overflow = "hidden";

  /* ------------------------------------------------------------------ */
  /* 2. PARTICLE BACKGROUND (canvas, connecting nodes, red/black theme) */
  /* ------------------------------------------------------------------ */
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationId;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initParticles() {
    const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(255, 27, 60, ${0.14 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // dots
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 77, 109, 0.55)";
      ctx.fill();
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  function setupParticles() {
    resizeCanvas();
    initParticles();
    if (animationId) cancelAnimationFrame(animationId);
    if (!prefersReducedMotion) {
      drawParticles();
    } else {
      // draw a single static frame for reduced motion users
      drawParticles();
      cancelAnimationFrame(animationId);
    }
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  setupParticles();

  /* ------------------------------------------------------------------ */
  /* 3. MOBILE NAVIGATION                                                */
  /* ------------------------------------------------------------------ */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ------------------------------------------------------------------ */
  /* 4. SCROLL REVEAL (custom lightweight AOS replacement)               */
  /* ------------------------------------------------------------------ */
  function startRevealObserver() {
    const items = document.querySelectorAll("[data-aos]");
    items.forEach((el, i) => {
      const delayAttr = el.getAttribute("data-aos-delay");
      el.style.setProperty("--aos-delay", `${delayAttr ? delayAttr : (i % 4) * 60}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* 5. TYPING ANIMATION FOR TITLE                                       */
  /* ------------------------------------------------------------------ */
  const typedEl = document.getElementById("typedTitle");
  const phrases = ["Mobile Technician", "Freelancer", "NFC Digital Card"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typedEl.textContent = current.substring(0, charIndex);

    let speed = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === current.length) {
      speed = 1400; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 350;
    }

    setTimeout(typeLoop, speed);
  }

  typeLoop();

  /* ------------------------------------------------------------------ */
  /* 6. ANIMATED COUNTERS                                                */
  /* ------------------------------------------------------------------ */
  const counters = document.querySelectorAll(".stat__num");

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ------------------------------------------------------------------ */
  /* 7. RIPPLE CLICK EFFECT                                              */
  /* ------------------------------------------------------------------ */
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".ripple");
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const circle = document.createElement("span");
    circle.className = "ripple-circle";
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;

    target.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  });

  /* ------------------------------------------------------------------ */
  /* 8. TOAST + COPY TO CLIPBOARD                                        */
  /* ------------------------------------------------------------------ */
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      const label = btn.getAttribute("data-label") || "Text";
      try {
        await navigator.clipboard.writeText(value);
        showToast(`${label} copied — ${value}`);
      } catch (err) {
        // fallback for older browsers
        const temp = document.createElement("textarea");
        temp.value = value;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
        showToast(`${label} copied — ${value}`);
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /* 9. SCROLL TO TOP BUTTON                                             */
  /* ------------------------------------------------------------------ */
  const scrollTopBtn = document.getElementById("scrollTop");

  window.addEventListener("scroll", () => {
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 420);
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ------------------------------------------------------------------ */
  /* 10. FLOATING ACTION BUTTON                                          */
  /* ------------------------------------------------------------------ */
  const fab = document.getElementById("fab");
  const fabToggle = document.getElementById("fabToggle");

  fabToggle.addEventListener("click", () => {
    fab.classList.toggle("is-open");
  });

  document.addEventListener("click", (e) => {
    if (!fab.contains(e.target)) fab.classList.remove("is-open");
  });

  /* ------------------------------------------------------------------ */
  /* 11. VCARD GENERATION + QR CODE                                      */
  /* ------------------------------------------------------------------ */
  const vCardString = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Arfat;Md Imteaz Hashem;;;",
    "FN:Md Imteaz Hashem Arfat",
    "TITLE:Mobile Technician | Freelancer",
    "TEL;TYPE=CELL:01621803362",
    "TEL;TYPE=WHATSAPP:01797227302",
    "EMAIL:Imteaz2332@gmail.com",
    "ADR;TYPE=WORK:;;Baluchara;Chattogram;;;Bangladesh",
    "URL:https://www.facebook.com/md.imteazarfat",
    "END:VCARD",
  ].join("\n");

  // Download button — build a Blob URL for the vCard file
  const vcardBtn = document.getElementById("vcardBtn");
  if (vcardBtn) {
    const blob = new Blob([vCardString], { type: "text/vcard" });
    vcardBtn.href = URL.createObjectURL(blob);
  }

  // QR code — encodes the vCard so scanning saves the contact directly
  const qrEl = document.getElementById("qrcode");
  if (qrEl && window.QRCode) {
    try {
      new QRCode(qrEl, {
        text: vCardString,
        width: 400,
        height: 400,
        colorDark: "#0c0c10",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M,
      });
    } catch (err) {
      qrEl.textContent = "QR unavailable offline";
    }
  }

  /* ------------------------------------------------------------------ */
  /* 12. FOOTER YEAR                                                     */
  /* ------------------------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* 13. SERVICE WORKER REGISTRATION (offline support)                   */
  /* ------------------------------------------------------------------ */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* fail silently — offline support is progressive enhancement */
      });
    });
  }
})();
