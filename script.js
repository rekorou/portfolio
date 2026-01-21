// ===== Elements
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const yearEl = document.getElementById("year");
const projectGrid = document.getElementById("projectGrid");
const contactForm = document.getElementById("contactForm");

// ===== Year
yearEl.textContent = new Date().getFullYear();

// ===== Mobile Menu
function setMenuOpen(open) {
  navLinks.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.contains("open");
  setMenuOpen(!isOpen);
});

// Close menu when clicking a link (mobile)
navLinks.addEventListener("click", (e) => {
  const a = e.target.closest("a.nav-link");
  if (a) setMenuOpen(false);
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  const clickedInside = navLinks.contains(e.target) || navToggle.contains(e.target);
  if (!clickedInside) setMenuOpen(false);
});

// ===== Theme Toggle (saved)
const THEME_KEY = "portfolio_theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = themeToggle.querySelector(".theme-icon");
  if (icon) icon.textContent = theme === "light" ? "☀" : "☾";
}

const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme || "dark");

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

// ===== Projects (edit here)
const projects = [
  {
    title: "Invensync (Inventory + POS System)",
    desc: "Java-based inventory management and POS system with sales tracking and .txt backups.",
    tags: ["Java", "JavaFX", "POS"],
    links: [
      { label: "Repo", href: "https://github.com/rekorou" },
      { label: "Demo", href: "#" }
    ]
  },
  {
    title: "Hotel Reservation System (HotelSys)",
    desc: "Reservation workflow UI with modules for clients, rooms, and operations.",
    tags: ["C#", "WinForms", "MySQL"],
    links: [
      { label: "Repo", href: "https://github.com/rekorou/HotelReservationSystem-HotelSys" },
      { label: "Demo", href: "#" }
    ]
  },
  {
    title: "Client-side JavaScript Activities",
    desc: "Small interactive web activities: DOM manipulation, logic, and dynamic content.",
    tags: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "Repo", href: "https://github.com/rekorou" },
      { label: "Live", href: "#" }
    ]
  }
];

function renderProjects() {
  projectGrid.innerHTML = "";

  projects.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card project";

    const tagsHtml = p.tags.map(t => `<span class="tag">${t}</span>`).join("");

    const linksHtml = p.links
      .filter(l => l.href && l.href !== "#")
      .map(l => `<a class="pill" href="${l.href}" target="_blank" rel="noreferrer">${l.label}</a>`)
      .join("");

    card.innerHTML = `
      <div class="project-top">
        <h3 style="margin:0">${p.title}</h3>
      </div>
      <p class="muted" style="margin:0">${p.desc}</p>
      <div class="tags">${tagsHtml}</div>
      <div class="project-links">${linksHtml || '<span class="muted tiny">Add links in script.js</span>'}</div>
    `;

    projectGrid.appendChild(card);
  });
}

renderProjects();

// ===== Active nav link (IntersectionObserver)
const sections = document.querySelectorAll("[data-section]");
const navAnchors = document.querySelectorAll(".nav-link");

function setActive(hash) {
  navAnchors.forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === hash);
  });
}

const observer = new IntersectionObserver((entries) => {
  // choose the entry most visible
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (visible) setActive(`#${visible.target.id}`);
}, {
  root: null,
  threshold: [0.2, 0.35, 0.5, 0.75]
});

sections.forEach(sec => observer.observe(sec));

// ===== Contact form validation (client-side only)
function markError(el, isError) {
  el.classList.toggle("error", isError);
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  const nameOk = name.value.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  const msgOk = message.value.trim().length >= 10;

  markError(name, !nameOk);
  markError(email, !emailOk);
  markError(message, !msgOk);

  if (nameOk && emailOk && msgOk) {
    alert("Message validated successfully! (Demo only — not actually sending.)");
    contactForm.reset();
  }
});
