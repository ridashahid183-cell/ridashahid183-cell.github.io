// ===========================
// Navbar scroll effect
// ===========================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===========================
// Hamburger menu
// ===========================
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===========================
// Active nav link on scroll
// ===========================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      navItems.forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ===========================
// Scroll animations (Intersection Observer)
// ===========================
const animateElements = document.querySelectorAll(
  '.info-card, .skill-card, .service-card, .portfolio-card, .contact-card, .section-header, .about-text, .hero-text, .hero-image'
);

animateElements.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animateElements.forEach(el => observer.observe(el));

// Hero visible on load
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-text, .hero-image').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 200);
  });
});

// ===========================
// Skill bar animation
// ===========================
const skillBars = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.getPropertyValue('--w') || getComputedStyle(entry.target).getPropertyValue('--w');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => {
  const targetWidth = getComputedStyle(bar).getPropertyValue('--w').trim();
  bar.style.width = '0%';
  skillObserver.observe(bar);
  bar.addEventListener('transitionend', () => {}, { once: true });
});

// Re-trigger skill bars properly
const skillSection = document.getElementById('skills');
const skillSectionObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    skillBars.forEach(bar => {
      const w = bar.style.getPropertyValue('--w') || bar.getAttribute('style').match(/--w:\s*([^;]+)/)?.[1] || '80%';
      bar.style.transition = 'width 1.2s ease';
      bar.style.width = w;
    });
    skillSectionObserver.unobserve(skillSection);
  }
}, { threshold: 0.2 });
if (skillSection) skillSectionObserver.observe(skillSection);

// ===========================
// Contact Form
// ===========================
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    formMsg.textContent = '';
    formMsg.className = 'form-msg';

    const formData = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        formMsg.textContent = '✅ Message sent! I will reply within 24 hours.';
        formMsg.className = 'form-msg success';
        form.reset();
      } else {
        formMsg.textContent = '❌ Something went wrong. Please try again.';
        formMsg.className = 'form-msg error';
      }
    } catch (err) {
      formMsg.textContent = '❌ Network error. Please check your connection.';
      formMsg.className = 'form-msg error';
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    setTimeout(() => { formMsg.textContent = ''; formMsg.className = 'form-msg'; }, 6000);
  });
}

// ===========================
// Smooth scroll offset for fixed navbar
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});
