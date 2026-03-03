/* ═══════════════════════════════════════════════
   HERO ENTRANCE SEQUENCE
   ═══════════════════════════════════════════════ */
function heroEntrance() {
  const els = document.querySelectorAll('.hero-el');
  const delays = [0, 300, 500, 700, 950]; // label, OMAR, photo, HAGAG, bottom
  els.forEach((el, i) => {
    const delay = delays[i] ?? i * 200;
    setTimeout(() => {
      el.classList.add('is-visible');
    }, delay + 200);
  });
  // Lift loading lock
  setTimeout(() => document.body.classList.remove('is-loading'), 100);
}

window.addEventListener('load', heroEntrance);

/* ═══════════════════════════════════════════════
   NAV — scroll state
   ═══════════════════════════════════════════════ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ═══════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════ */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
  // Animate burger spans
  const spans = burger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.transform = 'translateY(-1px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  }
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

/* ═══════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
   ═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   SERVICE ROWS — ACCORDION
   ═══════════════════════════════════════════════ */
document.querySelectorAll('.service-row__trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const row = trigger.closest('.service-row');
    const isOpen = row.classList.contains('is-open');
    const body = row.querySelector('.service-row__body');

    // Close all others
    document.querySelectorAll('.service-row.is-open').forEach(openRow => {
      if (openRow !== row) {
        openRow.classList.remove('is-open');
        openRow.querySelector('.service-row__trigger').setAttribute('aria-expanded', 'false');
        openRow.querySelector('.service-row__body').setAttribute('aria-hidden', 'true');
      }
    });

    // Toggle this one
    row.classList.toggle('is-open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
    body.setAttribute('aria-hidden', String(isOpen));
  });
});

/* ═══════════════════════════════════════════════
   WORK TABS
   ═══════════════════════════════════════════════ */
const tabs     = document.querySelectorAll('.work__tab');
const projects = document.querySelectorAll('.work__project');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Update tab states
    tabs.forEach(t => t.classList.toggle('is-active', t === tab));

    // Swap project panels with fade
    projects.forEach(p => {
      if (p.id === `tab-${target}`) {
        p.style.opacity = '0';
        p.classList.add('is-active');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            p.style.transition = 'opacity .4s ease';
            p.style.opacity = '1';
          });
        });
      } else {
        p.classList.remove('is-active');
        p.style.opacity = '';
        p.style.transition = '';
      }
    });
  });
});

/* ═══════════════════════════════════════════════
   HERO PARALLAX — subtle on scroll
   ═══════════════════════════════════════════════ */
const heroPhoto = document.querySelector('.hero__photo-wrap');

window.addEventListener('scroll', () => {
  if (!heroPhoto) return;
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  if (scrollY > vh) return; // only in hero viewport
  const offset = scrollY * 0.18;
  heroPhoto.style.transform = `translateX(-50%) translateY(${offset}px)`;
}, { passive: true });

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL — anchor links
   ═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

/* ═══════════════════════════════════════════════
   ACTIVE NAV LINK on scroll
   ═══════════════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
