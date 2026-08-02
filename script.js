/* =====================================================
   Thato Baruti portfolio interactions
   ===================================================== */

"use strict";

const navbar = document.getElementById("navbar");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

const handleNavbarScroll = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 48);
};

handleNavbarScroll();
window.addEventListener("scroll", handleNavbarScroll, { passive: true });

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navbar.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

const highlightNav = () => {
  let current = "";

  sections.forEach((section) => {
    const offset = section.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY >= offset - 140) {
      current = section.id;
    }
  });

  navAnchors.forEach((anchor) => {
    anchor.classList.toggle("active", anchor.getAttribute("href") === `#${current}`);
  });
};

highlightNav();
window.addEventListener("scroll", highlightNav, { passive: true });

document.querySelectorAll("a[href^='#']").forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetSelector = anchor.getAttribute("href");
    if (!targetSelector || targetSelector === "#") return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -48px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

const tabs = document.querySelectorAll(".path-tab");
const panels = document.querySelectorAll(".path-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selected = tab.dataset.path;

    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.panel === selected;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  });
});
