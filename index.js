/**
 * ALEX FRIMPONG GYIWAH - PORTFOLIO INTERACTION ENGINE
 * Software Developer & ICT Educator
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeader();
  initMobileMenu();
  initProjectFilters();
  initGpaSandbox();
  initCaseStudyModal();
  initContactForm();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   0. Dark / Light Theme Engine
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.querySelector('#themeToggleBtn');
  const sunIcon = toggleBtn ? toggleBtn.querySelector('.sun-icon') : null;
  const moonIcon = toggleBtn ? toggleBtn.querySelector('.moon-icon') : null;

  function getPreferredTheme() {
    const saved = localStorage.getItem('gyiwah_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        toggleBtn.setAttribute('title', 'Switch to dark theme');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', 'Switch to light theme');
        toggleBtn.setAttribute('title', 'Switch to light theme');
      }
    }
  }

  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = active === 'light' ? 'dark' : 'light';
      localStorage.setItem('gyiwah_theme', next);
      applyTheme(next);
    });
  }
}

/* --------------------------------------------------------------------------
   1. Header Scroll & Active Section Spy
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.querySelector('#mobileMenuBtn');
  const mainNav = document.querySelector('#mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuBtn || !mainNav) return;

  function toggleMenu(isOpen) {
    const willOpen = typeof isOpen === 'boolean' ? isOpen : !mainNav.classList.contains('open');
    mainNav.classList.toggle('open', willOpen);
    menuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    document.body.style.overflow = willOpen ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      toggleMenu(false);
      menuBtn.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Project Category Filter
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = card.classList.contains('flagship-card') ? 'grid' : 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   3.5. GPA Calculator Interactive Sandbox Engine
   -------------------------------------------------------------------------- */
function initGpaSandbox() {
  const tableBody = document.querySelector('#sandboxTableBody');
  const addBtn = document.querySelector('#sandboxAddCourseBtn');
  const resetBtn = document.querySelector('#sandboxResetBtn');
  const gpaValue = document.querySelector('#sandboxGpaValue');
  const classification = document.querySelector('#sandboxClassification');
  const totalCreditsEl = document.querySelector('#sandboxTotalCredits');
  const totalPointsEl = document.querySelector('#sandboxTotalPoints');

  if (!tableBody || !gpaValue) return;

  const defaultCourses = [
    { code: 'ICT 311: Data Structures', credits: 3, grade: '4.0' },
    { code: 'ICT 312: Database Systems', credits: 3, grade: '4.0' },
    { code: 'ICT 313: OOP with Java', credits: 3, grade: '3.5' },
    { code: 'EDU 314: Instructional Design', credits: 2, grade: '4.0' }
  ];

  function renderRow(course, index) {
    const tr = document.createElement('tr');
    tr.dataset.row = index + 1;
    tr.innerHTML = `
      <td><input type="text" class="sandbox-input course-code" value="${course.code}" aria-label="Course Title"></td>
      <td>
        <select class="sandbox-select course-credits" aria-label="Course Credits">
          <option value="1" ${course.credits === 1 ? 'selected' : ''}>1 Credit</option>
          <option value="2" ${course.credits === 2 ? 'selected' : ''}>2 Credits</option>
          <option value="3" ${course.credits === 3 ? 'selected' : ''}>3 Credits</option>
          <option value="4" ${course.credits === 4 ? 'selected' : ''}>4 Credits</option>
        </select>
      </td>
      <td>
        <select class="sandbox-select course-grade" aria-label="Course Grade">
          <option value="4.0" ${course.grade === '4.0' ? 'selected' : ''}>A (4.0 &middot; 80-100%)</option>
          <option value="3.5" ${course.grade === '3.5' ? 'selected' : ''}>B+ (3.5 &middot; 75-79%)</option>
          <option value="3.0" ${course.grade === '3.0' ? 'selected' : ''}>B (3.0 &middot; 70-74%)</option>
          <option value="2.5" ${course.grade === '2.5' ? 'selected' : ''}>C+ (2.5 &middot; 65-69%)</option>
          <option value="2.0" ${course.grade === '2.0' ? 'selected' : ''}>C (2.0 &middot; 60-64%)</option>
          <option value="1.5" ${course.grade === '1.5' ? 'selected' : ''}>D+ (1.5 &middot; 55-59%)</option>
          <option value="1.0" ${course.grade === '1.0' ? 'selected' : ''}>D (1.0 &middot; 50-54%)</option>
          <option value="0.0" ${course.grade === '0.0' ? 'selected' : ''}>E (0.0 &middot; Fail)</option>
        </select>
      </td>
      <td style="text-align: center;">
        <button type="button" class="sandbox-delete-btn" title="Remove course" aria-label="Remove Course" style="background: transparent; border: none; color: var(--text-faint); cursor: pointer; padding: 4px;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;
    return tr;
  }

  function calculateGPA() {
    const rows = tableBody.querySelectorAll('tr');
    let totalCredits = 0;
    let totalPoints = 0;

    rows.forEach(row => {
      const creditsEl = row.querySelector('.course-credits');
      const gradeEl = row.querySelector('.course-grade');
      if (creditsEl && gradeEl) {
        const credits = parseFloat(creditsEl.value) || 0;
        const gradePoint = parseFloat(gradeEl.value) || 0;
        totalCredits += credits;
        totalPoints += (credits * gradePoint);
      }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    gpaValue.textContent = gpa.toFixed(2);
    if (totalCreditsEl) totalCreditsEl.textContent = totalCredits;
    if (totalPointsEl) totalPointsEl.textContent = totalPoints.toFixed(2);

    if (classification) {
      if (gpa >= 3.60) {
        classification.textContent = 'First Class Honours';
        classification.className = 'badge badge-verified';
      } else if (gpa >= 3.00) {
        classification.textContent = 'Second Class Upper Division';
        classification.className = 'badge badge-live';
      } else if (gpa >= 2.50) {
        classification.textContent = 'Second Class Lower Division';
        classification.className = 'badge badge-academic';
      } else if (gpa >= 2.00) {
        classification.textContent = 'Third Class';
        classification.className = 'badge';
      } else if (gpa >= 1.00) {
        classification.textContent = 'Pass';
        classification.className = 'badge';
      } else {
        classification.textContent = 'Fail / Unsatisfactory';
        classification.className = 'badge';
      }
    }
  }

  tableBody.addEventListener('change', calculateGPA);
  tableBody.addEventListener('input', calculateGPA);

  tableBody.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.sandbox-delete-btn');
    if (deleteBtn) {
      const row = deleteBtn.closest('tr');
      const allRows = tableBody.querySelectorAll('tr');
      if (allRows.length > 1) {
        row.remove();
      } else {
        row.querySelector('.course-code').value = 'New Course';
        row.querySelector('.course-credits').value = '3';
        row.querySelector('.course-grade').value = '4.0';
      }
      calculateGPA();
    }
  });

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const count = tableBody.querySelectorAll('tr').length + 1;
      const newTr = renderRow({ code: `Elective ${count}`, credits: 3, grade: '4.0' }, count);
      tableBody.appendChild(newTr);
      calculateGPA();
      newTr.querySelector('.course-code').focus();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      tableBody.innerHTML = '';
      defaultCourses.forEach((c, idx) => {
        tableBody.appendChild(renderRow(c, idx));
      });
      calculateGPA();
    });
  }

  calculateGPA();
}

/* --------------------------------------------------------------------------
   4. Deep Case Study Modal Data & Engine
   -------------------------------------------------------------------------- */
const CASE_STUDY_DATA = {
  scas: {
    title: 'SCAS: Smart Classroom Attendance System',
    category: 'Institutional Educational Systems · Database Engineering',
    badges: ['Database Engineered', '47-Assertion Verified', 'Web & Mobile'],
    heroImage: 'assets/images/projects/scas-erd-full.png',
    caption: 'SCAS Full 21-Table Relational Schema & Attendance Ledger (MariaDB)',
    problem: 'Manual paper-based attendance in tertiary and secondary institutions causes widespread buddy-punching, lost attendance sheets, late submissions, and significant administrative delay when computing exam qualification thresholds.',
    users: 'School administrators, headteachers, course lecturers, and enrolled students.',
    contribution: 'Alex designed the entire MariaDB schema (20+ tables, 42 procedures, 26 triggers), developed the PHP administrative control portal, and implemented the Expo mobile QR token scanner companion.',
    keyDecisions: [
      {
        heading: 'Database-Enforced Business Rules',
        text: 'Rather than trusting client-side logic, core constraints (e.g. valid lecture schedule windows, one scan per student per session, teacher proximity, and quota tracking) are strictly evaluated via SQL stored procedures and triggers.'
      },
      {
        heading: 'Time-Expiring Cryptographic QR Tokens',
        text: 'Attendance QR codes refresh periodically with time-bounded disposable tokens. Capturing a photo of the projected QR code and sharing it via messaging apps fails verification outside the classroom window.'
      },
      {
        heading: 'Audit Ledger & Sensitive Data Encryption',
        text: 'Teacher records and sensitive personal identifiers are encrypted via AES-256 (teacher_sensitive table). An immutable audit log traces all administrative modifications, override actions, and attendance disputes.'
      }
    ],
    testing: 'Project documents a 47-assertion automated verification test suite checking timetable overlaps, concurrent scan contention, procedure rollbacks, and security event generation in MariaDB.',
    limitations: 'Designed and tested for MariaDB/MySQL environments; live mobile production rollout requires active camera permissions and TLS/HTTPS endpoint certification.',
    nextSteps: 'Implementing biometric fingerprint fallback and geofencing radius validation for expansive lecture halls.'
  },
  omnipos: {
    title: 'OmniPOS: Retail Operations & Inventory Platform',
    category: 'Retail & Multi-Branch Systems',
    badges: ['Live Production Demo', 'React PWA', 'Vercel Hosted'],
    heroImage: 'assets/images/projects/omnipos-desktop.png',
    caption: 'OmniPOS Live Register Sign-in & Till Management Interface',
    problem: 'Retail merchants operating multiple store branches suffer from inventory discrepancies, sluggish legacy desktop registers, and downtime when unstable internet connections drop during checkout.',
    users: 'Cashiers, retail floor managers, multi-store owners, and inventory clerks.',
    contribution: 'Engineered the mobile-first React PWA frontend, implemented flash-free theme hydration in the head script, built the client-side cart calculation engine, and integrated the Laravel/PostgreSQL REST backend.',
    keyDecisions: [
      {
        heading: 'Zero-Flash Dark Theme Ahead of Hydration',
        text: 'Runs a tiny dependency-free script in the HTML document head to read localStorage before the React bundle paints, ensuring till screens never flash white when booting behind retail counters.'
      },
      {
        heading: 'Fast Ergonomic Till Workflow',
        text: 'Designed specifically for rapid keyboard and touch scanning, instant cart totals, quick payment splits, and structured till session reconciliation.'
      },
      {
        heading: 'Decoupled Cloud & Offline Direction',
        text: 'Architecture separates transactional counter workflows from heavy cloud synchronization, enabling reliable local operation.'
      }
    ],
    testing: 'Tested across desktop and tablet viewports on Vercel deployment; verified theme persistence and till sign-in flow.',
    limitations: 'Live public demo at omnipos-three.vercel.app features till authorization interface; multi-store inventory sync requires active backend tenant credentials.',
    nextSteps: 'Enabling Web Bluetooth receipt printing and barcode scanner hardware integration via WebHID.'
  },
  ascenda: {
    title: 'Ascenda: School Management & Grading System',
    category: 'Educational Management Systems · Mobile Architecture',
    badges: ['Role-Based RBAC', 'Supabase Postgres RLS', 'Expo React Native'],
    heroImage: 'assets/images/projects/ascenda-logo.png',
    caption: 'Ascenda Institutional Portal Branding & UI Architecture',
    problem: 'Basic and senior high schools struggle with manual grade computation, transcript generation, student promotion record errors, and unauthorized grade alterations during terminal report preparation.',
    users: 'Super Admins, School Admins, Headmasters, Subject Teachers, and Academic Deans.',
    contribution: 'Spearheaded mobile architecture using React Native/Expo and PostgreSQL on Supabase, structuring database schemas, automated assessment computation, and role-based access rules.',
    keyDecisions: [
      {
        heading: 'PostgreSQL Row Level Security (RLS)',
        text: 'Granular security policies enforce that teachers can only view and update scores for their assigned classes and subjects, while Headmasters hold exclusive promotion approval rights.'
      },
      {
        heading: 'Automated Continuous Assessment (CA) & Exam Engine',
        text: 'System automatically calculates weighted Class Assessment + Exam scores into standard A–F letter grades and generates standard institutional remarks without manual calculation errors.'
      },
      {
        heading: 'Headmaster Promotion Workflow',
        text: 'Structured promotion review queue allowing academic heads to evaluate student term cumulative records and approve grade promotions or retentions.'
      }
    ],
    testing: 'Tested in local React Native Expo simulation environment against Supabase PostgreSQL test instances.',
    limitations: 'Student view-only access is documented as subsequent phase development; requires active Supabase keys for live synchronization.',
    nextSteps: 'Parent portal notification engine via SMS/WhatsApp for terminal report release.'
  },
  gpa: {
    title: 'GPA Calculator & Performance Analytics',
    category: 'Academic Utility · Public Open Source Tool',
    badges: ['Live on GitHub Pages', 'Pure JavaScript Engine', 'Public Repository'],
    heroImage: 'assets/images/projects/gpa-calculator-dark.png',
    caption: 'Live GPA Calculator Dashboard with Cumulative Metric Cards & Trend Graph',
    problem: 'Tertiary students struggle to accurately calculate their credit-weighted GPA, understand the mathematical impact of retakes, or plan what target semester GPAs are required to earn their desired class of degree.',
    users: 'University and college students across tertiary institutions in Ghana and West Africa.',
    contribution: 'Designed and built the entire application from mathematical core (gpa-core.js) to responsive user interface, CSV export, print stylesheet, and theme engine.',
    keyDecisions: [
      {
        heading: 'Zero-Dependency Pure Calculation Core',
        text: 'Isolated all mathematical credit weighting, quality point calculations, and honours classifications into a standalone, testable JavaScript module.'
      },
      {
        heading: 'Visual Target Analytics & Trend Chart',
        text: 'Integrated dynamic semester performance visualization allowing students to set a target GPA (e.g. 3.50 for First Class) and immediately see if they are on track.'
      },
      {
        heading: 'Print & CSV Report Export',
        text: 'Built client-side data export to CSV and CSS @media print optimization so students can print clean academic tracking sheets directly.'
      }
    ],
    testing: 'Verified against University of Education, Winneba (UEW) official GPA scale across multiple semesters and course credit distributions.',
    limitations: 'Default grading scheme follows UEW / 4.0 credit-weighted system; future iterations will support custom institutional scales.',
    nextSteps: 'Adding multi-institutional scale presets (KNUST, UG, UCC) and GPA projection simulator.'
  },
  electo: {
    title: 'Electo: Election Management & Voting System',
    category: 'Civic Technology · Voting & Governance',
    badges: ['PHP 8 & MySQL', 'Audit Logging', 'Synthetic Verification'],
    heroImage: 'assets/images/projects/scas-qr-sample.svg',
    caption: 'Electo Voting Platform & Cryptographic Verification Model',
    problem: 'Student union and departmental elections suffer from lack of transparency, ballot handling disputes, slow vote counting, and vulnerability to ballot manipulation.',
    users: 'Electoral commissioners, registered student voters, candidates, and poll observers.',
    contribution: 'Architected the PHP 8+ and MySQL voting engine, ballot verification workflows, first-admin bootstrap setup, and candidate management interface.',
    keyDecisions: [
      {
        heading: 'Strict Single-Ballot Enforcement',
        text: 'Database constraints and session tokens prevent duplicate voting attempts while maintaining voter privacy through pseudonymized ballot casting.'
      },
      {
        heading: 'Tamper-Resistant Result Audit Trail',
        text: 'Every ballot cast updates an immutable vote counter and audit ledger with timestamp and device session hashes.'
      },
      {
        heading: 'Clean Administrative Governance',
        text: 'Electoral commissioners can manage election categories, candidate profiles, voter rolls, and live tally visualization.'
      }
    ],
    testing: 'Tested in local Apache/XAMPP environment using synthetic voter and candidate mock callsets.',
    limitations: 'Intended for supervised institutional and campus elections; production deployment requires SMS gateway integration and hardened hosting.',
    nextSteps: 'Zero-knowledge cryptographic ballot verification protocol.'
  }
};

function initCaseStudyModal() {
  const modal = document.querySelector('#caseStudyModal');
  const modalBody = document.querySelector('#modalBody');
  const closeBtn = document.querySelector('#modalCloseBtn');
  const triggerBtns = document.querySelectorAll('[data-case-study]');

  if (!modal || !modalBody || !closeBtn) return;

  function openModal(projectId) {
    const data = CASE_STUDY_DATA[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="cs-modal-header" style="margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle);">
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent); text-transform: uppercase; margin-bottom: 0.4rem;">
          ${data.category}
        </div>
        <h2 style="font-size: clamp(1.6rem, 2.8vw, 2.2rem); font-weight: 800; color: var(--text-primary); margin-bottom: 0.75rem;">
          ${data.title}
        </h2>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${data.badges.map(b => `<span class="badge badge-verified">${b}</span>`).join('')}
        </div>
      </div>

      <div class="cs-modal-hero" style="margin-bottom: 2rem; background: #070b14; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-medium); box-shadow: var(--shadow-md);">
        <img src="${data.heroImage}" alt="${data.title}" style="width: 100%; max-height: 480px; object-fit: contain; background: #050810; padding: 10px;">
        <div style="padding: 0.65rem 1rem; background: rgba(14, 21, 38, 0.95); font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle);">
          ${data.caption}
        </div>
      </div>

      <div class="cs-modal-sections" style="display: flex; flex-direction: column; gap: 1.75rem;">
        <div class="cs-section-box">
          <h4>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Problem & Context
          </h4>
          <p>${data.problem}</p>
        </div>

        <div class="cs-section-box">
          <h4>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Intended Users & Stakeholders
          </h4>
          <p>${data.users}</p>
        </div>

        <div class="cs-section-box">
          <h4>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            My Technical Contribution
          </h4>
          <p>${data.contribution}</p>
        </div>

        <div class="cs-section-box">
          <h4>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Key Engineering Decisions & Architecture
          </h4>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 0.75rem;">
            ${data.keyDecisions.map(kd => `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
                <strong style="color: var(--text-primary); font-size: 0.95rem; display: block; margin-bottom: 0.35rem;">${kd.heading}</strong>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">${kd.text}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          <div class="cs-section-box" style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-md); padding: 1.25rem;">
            <h4 style="color: #34d399;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Verification & Testing
            </h4>
            <p style="font-size: 0.9rem;">${data.testing}</p>
          </div>

          <div class="cs-section-box" style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: var(--radius-md); padding: 1.25rem;">
            <h4 style="color: #fbbf24;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Trade-offs & Boundaries
            </h4>
            <p style="font-size: 0.9rem;">${data.limitations}</p>
          </div>
        </div>

        <div class="cs-section-box">
          <h4>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
            Outcomes & Future Roadmap
          </h4>
          <p>${data.nextSteps}</p>
        </div>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-case-study');
      openModal(projectId);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Contact Form & Email Copy Utility
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('#contactForm');
  const alertBox = document.querySelector('#formAlert');
  const copyBtn = document.querySelector('#copyEmailBtn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'alexfrimpong9@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const origText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Copied to clipboard!
        `;
        setTimeout(() => {
          copyBtn.innerHTML = origText;
        }, 3000);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.querySelector('#fullName').value.trim();
      const email = document.querySelector('#email').value.trim();
      const subject = document.querySelector('#subject').value.trim();
      const message = document.querySelector('#message').value.trim();

      if (!name || !email || !subject || !message) {
        showAlert('Please fill in all required fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert('Please provide a valid email address.', 'error');
        return;
      }

      // Compose mailto fallback and show friendly confirmation
      const mailtoLink = `mailto:alexfrimpong9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      
      showAlert(`Thank you, ${name}! Your email client will now open to deliver your message directly.`, 'success');

      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 1200);

      form.reset();
    });
  }

  function showAlert(text, type) {
    if (!alertBox) return;
    alertBox.textContent = text;
    alertBox.className = `form-alert ${type}`;
    alertBox.style.display = 'block';

    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 6000);
  }
}

/* --------------------------------------------------------------------------
   6. Smooth Anchor Scrolling
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
