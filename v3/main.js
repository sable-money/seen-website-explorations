"use strict";
// ============================================
// SEEN FINANCE — MAIN TYPESCRIPT
// ============================================
// --- Scroll Reveal ---
class ScrollReveal {
    constructor(options = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.dataset.revealDelay || '0', 10);
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, delay);
                    this.observer.unobserve(el);
                }
            });
        }, options);
    }
    observe() {
        document.querySelectorAll('[data-reveal]').forEach((el) => {
            this.observer.observe(el);
        });
    }
}
// --- Counter Animation ---
class CounterAnimator {
    constructor() {
        this.animated = new Set();
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, { threshold: 0.5 });
    }
    observe() {
        document.querySelectorAll('[data-count-target]').forEach((el) => {
            this.observer.observe(el);
        });
    }
    animateCounter(el) {
        const target = parseInt(el.dataset.countTarget || '0', 10);
        const prefix = el.dataset.countPrefix || '';
        const suffix = el.dataset.countSuffix || '';
        const useSeparator = el.dataset.countSeparator === ',';
        const duration = 2000;
        const startTime = performance.now();
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * target);
            let formatted = current.toString();
            if (useSeparator) {
                formatted = current.toLocaleString('en-US');
            }
            el.textContent = `${prefix}${formatted}${suffix}`;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    }
}
// --- Timeline Line Animation ---
class TimelineAnimator {
    constructor() {
        this.line = document.getElementById('timeline-line');
        this.section = document.getElementById('journey');
    }
    init() {
        if (!this.line || !this.section)
            return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.line?.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(this.section);
    }
}
// --- Mobile Menu ---
class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.burger = document.getElementById('nav-burger');
        this.menu = document.getElementById('nav-menu');
    }
    init() {
        if (!this.burger || !this.menu)
            return;
        this.burger.addEventListener('click', () => this.toggle());
        // Close on link click
        this.menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => this.close());
        });
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen)
                this.close();
        });
    }
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    open() {
        this.isOpen = true;
        this.burger?.classList.add('active');
        this.burger?.setAttribute('aria-expanded', 'true');
        this.menu?.classList.add('open');
    }
    close() {
        this.isOpen = false;
        this.burger?.classList.remove('active');
        this.burger?.setAttribute('aria-expanded', 'false');
        this.menu?.classList.remove('open');
    }
}
// --- FAQ Accordion ---
class Accordion {
    constructor(selector) {
        this.items = document.querySelectorAll(selector);
    }
    init() {
        this.items.forEach((item) => {
            const trigger = item.querySelector('.faq-item__trigger');
            if (!trigger)
                return;
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                // Close all
                this.items.forEach((i) => {
                    i.classList.remove('open');
                    i.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'false');
                });
                // Open clicked (if it was closed)
                if (!isOpen) {
                    item.classList.add('open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }
}
// --- Sticky Nav ---
class StickyNav {
    constructor(threshold = 80) {
        this.nav = document.querySelector('.nav');
        this.scrollThreshold = threshold;
    }
    init() {
        if (!this.nav)
            return;
        const check = () => {
            if (window.scrollY > this.scrollThreshold) {
                this.nav?.classList.add('scrolled');
            }
            else {
                this.nav?.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', check, { passive: true });
        check();
    }
}
// --- Smooth Scroll for Anchor Links ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#')
                return;
            const target = document.querySelector(href);
            if (!target)
                return;
            e.preventDefault();
            const navHeight = document.querySelector('.nav')?.getBoundingClientRect().height || 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}
// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    const reveal = new ScrollReveal();
    reveal.observe();
    const counters = new CounterAnimator();
    counters.observe();
    const timeline = new TimelineAnimator();
    timeline.init();
    const menu = new MobileMenu();
    menu.init();
    const faq = new Accordion('.faq-item');
    faq.init();
    const nav = new StickyNav();
    nav.init();
    initSmoothScroll();
});
