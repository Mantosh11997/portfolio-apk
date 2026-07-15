/* ============================================================
   MANTOSH SINGH PORTFOLIO — script.js
   ============================================================ */

// ── App Boot Preloader ─────────────────────────────────────
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const textEl = document.getElementById('bootText');
  const line1 = document.getElementById('termLine1');
  const line2 = document.getElementById('termLine2');
  const line3 = document.getElementById('termLine3');
  const line4 = document.getElementById('termLine4');
  const line5 = document.getElementById('termLine5');
  const cursor = document.getElementById('termCursor');
  if (!preloader || !textEl) return;

  const bootSequence = '> initializing Mantosh.Singh...';
  let i = 0;

  function typeBootText() {
    if (i < bootSequence.length) {
      textEl.textContent += bootSequence.charAt(i);
      i++;
      setTimeout(typeBootText, 35 + Math.random() * 40); // Natural random typing speed
    } else {
      // Simulate terminal processes completing
      setTimeout(() => { 
        cursor.style.display = 'none'; 
        line1.innerHTML = '<span style="color:var(--green)">[OK]</span> Dependencies resolved.'; 
      }, 500);
      setTimeout(() => { 
        line2.innerHTML = '<span style="color:var(--green)">[OK]</span> Connecting to backend services...'; 
      }, 1000);
      setTimeout(() => { 
        line3.innerHTML = '<span style="color:var(--green)">[OK]</span> Loading neural models & vectors...'; 
      }, 1500);
      setTimeout(() => { 
        line4.innerHTML = '<span style="color:var(--green)">[OK]</span> Compiling styles & assets...'; 
      }, 2000);
      setTimeout(() => { 
        line5.innerHTML = '<span style="color:var(--green)">[OK]</span> Starting UI components...<span class="terminal-cursor">_</span>'; 
      }, 2500);
      setTimeout(() => {
        preloader.classList.add('hidden'); // Triggers the slide-up CSS animation
        document.body.classList.remove('no-scroll'); // Re-enables website scrolling
        setTimeout(() => preloader.remove(), 1000); // Cleans up the DOM entirely
      }, 3300);
    }
  }
  
  // Start typing slightly after the screen paints
  setTimeout(typeBootText, 250);
})();

// ── Theme toggle ─────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', (e) => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';

  // Fallback for browsers that don't support View Transitions yet
  if (!document.startViewTransition) {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    return;
  }

  // Get click coordinates and calculate the required radius to cover the screen
  const x = e.clientX;
  const y = e.clientY;
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  // Start the view transition snapshot
  const transition = document.startViewTransition(() => {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Animate the new theme expanding as a circle from the click point
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
      { duration: 600, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' }
    );
  });
});

// ── Navbar scroll ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile menu ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-link').forEach(link =>
  link.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ── Particle canvas ─────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, animId;

  const PARTICLE_COUNT = 60;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.5 + 0.15,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, randomParticle);
  }

  function getAccentColor() {
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? '37,99,235' : '59,130,246';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const c = getAccentColor();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c},${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${c},${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); draw(); }, { passive: true });
  init();
  draw();
})();

// ── Typing animation ─────────────────────────────────────────
(function initTyped() {
  const phrases = [
    'Enterprise Systems Architecture.',
    'Scalable Cloud Solutions.',
    'AI-Powered Microservices.',
    'High-Performance APIs.',
    'Full-Stack Web Development.',
    'Data Analytics Pipelines.',
  ];
  const el = document.getElementById('typedText');
  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 70, SPEED_DEL = 40, PAUSE = 1800;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) { deleting = true; setTimeout(type, PAUSE); return; }
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(type, 800);
})();

// ── Counter animation ─────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const dur = 1200;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const pct = Math.min(elapsed / dur, 1);
    const eased = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(eased * target);
    if (pct < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── Skill bar animation ─────────────────────────────────────────
function animateSkillBars(section) {
  section.querySelectorAll('.bar-fill').forEach(bar => {
    const pct = bar.getAttribute('data-pct');
    bar.style.width = pct + '%';
  });
}

// ── Intersection Observer (reveal + counters + bars) ─────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    // Reveal cards
    if (el.classList.contains('reveal')) {
      el.classList.add('visible');

      // Simulate skeleton loading state on project cards
      if (el.classList.contains('is-loading')) {
        const loadTime = 800 + Math.random() * 1000; // Delay between 800ms and 1800ms
        setTimeout(() => el.classList.remove('is-loading'), loadTime);
      }
    }

    // About stats counters
    if (el.id === 'about') {
      el.querySelectorAll('.stat-num').forEach(animateCounter);
    }

    // Skill bars
    if (el.classList.contains('skill-category')) animateSkillBars(el);

    io.unobserve(el);
  });
}, { threshold: 0.15 });

// Observe everything
document.querySelectorAll('.reveal, #about, .skill-category').forEach(el => io.observe(el));

// ── Contact form ─────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  const btn = this.querySelector('.btn-text');
  btn.textContent = 'Sending…';

  setTimeout(() => {
    note.textContent = 'Thanks for reaching out! I\'ll get back to you soon.';
    note.className = 'form-note success';
    btn.textContent = 'Send Message';
    this.reset();
    setTimeout(() => { note.textContent = ''; note.className = 'form-note'; }, 5000);
  }, 1000);
});

// ── Back to top ─────────────────────────────────────────────
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  btt.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Active nav link on scroll ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ── Smooth scroll for all internal links ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── 3D Tilt Effect on Project Cards ─────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    if (card.classList.contains('is-loading')) return;
    // Set a fast transition for smoothly tracking the mouse
    card.style.transition = 'transform 0.1s ease-out, background 0.1s ease-out';
  });

  card.addEventListener('mousemove', (e) => {
    if (card.classList.contains('is-loading')) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Increased rotation angles to 12 degrees for higher visibility
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Dynamic glare effect that follows the cursor
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(255,255,255,0.06) 0%, transparent 50%), var(--surface)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), background 0.6s ease';
    card.style.transform = 'perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.background = 'var(--surface)';
    
    setTimeout(() => { 
      card.style.transition = ''; 
      card.style.transform = ''; 
      card.style.background = ''; 
    }, 600);
  });
});

// ── Custom Cursor ─────────────────────────────────────────────
(function initCustomCursor() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorTrail = document.getElementById('cursorTrail');
  if (!cursorDot || !cursorTrail) return;

  let mouseX = -100, mouseY = -100;
  let trailX = -100, trailY = -100;
  let initialized = false;

  window.addEventListener('mousemove', (e) => {
    if (!initialized) {
      cursorDot.style.opacity = 1;
      cursorTrail.style.opacity = 1;
      trailX = e.clientX;
      trailY = e.clientY;
      initialized = true;
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Instantly map the small dot to the mouse coordinates
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    // Expand the cursor trail when hovering over specific elements
    const isHovering = e.target.closest('a, button, input, textarea, .project-card, .code-block, .theme-toggle');
    cursorTrail.classList.toggle('hover', !!isHovering);
  });

  // Fade out cursor when mouse leaves the browser window entirely
  document.addEventListener('mouseleave', () => { cursorDot.style.opacity = 0; cursorTrail.style.opacity = 0; });
  document.addEventListener('mouseenter', () => { if(initialized) { cursorDot.style.opacity = 1; cursorTrail.style.opacity = 1; } });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.2; // 0.2 is the lerp (lag) factor
    trailY += (mouseY - trailY) * 0.2;
    cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
})();

// ── Hero Parallax Effect ─────────────────────────────────────
const heroCanvasLayer = document.getElementById('particleCanvas');
const heroVisualLayer = document.querySelector('.hero-visual');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  // Only calculate and apply parallax when the hero section is in the viewport
  if (scrollY <= window.innerHeight) {
    if (heroCanvasLayer) heroCanvasLayer.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
    if (heroVisualLayer) heroVisualLayer.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
  }
}, { passive: true });

// ── Magnetic UI Elements ─────────────────────────────────────
document.querySelectorAll('.btn, .theme-toggle, .social-chip').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // 0.3 multiplier gives a subtle, premium pulling effect
    el.style.transition = 'transform 0.1s ease-out';
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });

  el.addEventListener('mouseleave', () => {
    // Spring back to original position using a bouncy cubic-bezier
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.transform = 'translate(0px, 0px)';
    
    // Hand control back to CSS after animation completes
    setTimeout(() => { 
      el.style.transition = ''; 
      el.style.transform = ''; 
    }, 500);
  });
});

// ── Scroll-Driven Timeline SVG Animation ─────────────────────
(function initTimelineScroll() {
  const timeline = document.querySelector('.timeline');
  const path = document.getElementById('timelinePath');
  if (!timeline || !path) return;

  function updateDraw() {
    const rect = timeline.getBoundingClientRect();
    const pathLength = timeline.offsetHeight;
    
    // Set actual pixel height for accurate dasharray calculation
    path.setAttribute('y2', pathLength);
    path.style.strokeDasharray = pathLength;
    
    // Draw line as user scrolls down. Starts when timeline top is at 75% of viewport
    const startOffset = window.innerHeight * 0.75;
    let drawLength = startOffset - rect.top;
    
    if (drawLength < 0) drawLength = 0;
    if (drawLength > pathLength) drawLength = pathLength;
    
    path.style.strokeDashoffset = pathLength - drawLength;
  }

  window.addEventListener('scroll', updateDraw, { passive: true });
  window.addEventListener('resize', updateDraw, { passive: true });
  setTimeout(updateDraw, 100);
})();

// ── Live Local Timezone Widget ─────────────────────────────────
(function initTimeWidget() {
  const timeWidget = document.getElementById('timeWidget');
  if (!timeWidget) return;
  
  function updateTime() {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    
    timeWidget.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      📍 Mohali, IN <span style="opacity: 0.4; margin: 0 4px;">•</span> <strong style="color:var(--text);font-weight:600;">${timeString}</strong>
    `;
  }
  
  setInterval(updateTime, 1000);
  updateTime();
})();

// ── Hacker Text Scramble Effect ─────────────────────────────────
const hackerChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
document.querySelectorAll('.section-title').forEach(el => {
  el.addEventListener('mouseenter', event => {
    let iterations = 0;
    const originalText = event.target.dataset.value;
    if (!originalText) return;
    
    clearInterval(el.interval);
    el.interval = setInterval(() => {
      event.target.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iterations) return originalText[index];
          if (originalText[index] === " ") return " ";
          return hackerChars[Math.floor(Math.random() * hackerChars.length)];
        }).join("");
      
      if (iterations >= originalText.length) clearInterval(el.interval);
      iterations += 1 / 3; // Determines the speed of character resolution
    }, 30);
  });
});

// ── AI Chatbot Demo ─────────────────────────────────────────────
(function initChatbot() {
  const chatBody = document.getElementById('chatBody');
  const chatWindow = document.getElementById('chatWindow');
  const chatBubbleBtn = document.getElementById('chatBubbleBtn');
  const chatMinBtn = document.getElementById('chatMinBtn');

  if (!chatBody) return;

  if (chatBubbleBtn && chatMinBtn && chatWindow) {
    chatMinBtn.addEventListener('click', () => {
      chatWindow.classList.remove('open');
      chatBubbleBtn.classList.remove('hidden');
    });
    chatBubbleBtn.addEventListener('click', () => {
      chatWindow.classList.add('open');
      chatBubbleBtn.classList.add('hidden');
    });
  }

  const demoScript = [
    { sender: 'user', text: "Hi! Can you tell me about the architecture of this RAG model?" },
    { sender: 'ai', text: "Hello! This simulated chatbot is based on the RAG model built using FastAPI, ChromaDB, and a locally-hosted LLaMA 3 model." },
    { sender: 'user', text: "How does the document retrieval work?" },
    { sender: 'ai', text: "It splits documents into overlapping chunks, generates embeddings using sentence-transformers, and uses cosine similarity to find the most relevant context." },
    { sender: 'user', text: "Does it rely on any cloud AI APIs?" },
    { sender: 'ai', text: "Not at all. Everything runs 100% locally to ensure data privacy and zero API costs." },
    { sender: 'user', text: "That's impressive. Thanks for the details!" },
    { sender: 'ai', text: "You're welcome! Feel free to check out the 'Key Projects' section to see more details." },
    { sender: 'ai', text: "The demo will now restart..." }
  ];

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    if (text === 'typing') {
      msgDiv.classList.add('chat-typing');
      msgDiv.innerHTML = '<span></span><span></span><span></span>';
    } else {
      msgDiv.innerHTML = `<p>${text}</p>`;
    }
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    return msgDiv;
  }

  let msgIndex = 0;

  function playNextMessage() {
    if (msgIndex >= demoScript.length) {
      setTimeout(() => {
        chatBody.innerHTML = '';
        msgIndex = 0;
        playNextMessage();
      }, 4000); // Wait 4 seconds before restarting the loop
      return;
    }

    const msg = demoScript[msgIndex];
    const typingIndicator = appendMessage('typing', msg.sender);
    const typingDelay = msg.sender === 'user' ? 800 : 1500; // AI takes longer to 'think'

    setTimeout(() => {
      typingIndicator.remove();
      appendMessage(msg.text, msg.sender);
      msgIndex++;
      setTimeout(playNextMessage, 1800); // Wait 1.8 seconds before the next person starts typing
    }, typingDelay);
  }

  // Start the automated chat loop after page loads
  setTimeout(playNextMessage, 2000);
})();
