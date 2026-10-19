/**
 * E-PORTOFOLIO INTERAKTIF SEMINAR PPG CALON GURU 2026
 * Siti Wafiq Aliyatun Nurur Rohmana, S.Pd.
 * Universitas Muhammadiyah Purwokerto - Prodi PPKn
 * Interactive Navigation & Presentation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const slides = Array.from(document.querySelectorAll('.slide-section'));
  const totalSlides = slides.length;
  let currentSlide = 0;
  let isPresentationMode = true; // Default: Presentation deck mode for Seminar PPG

  const progressBar = document.getElementById('progressBarFill');
  const slideCounter = document.getElementById('slideCounter');
  const quickJumpSelect = document.getElementById('quickJumpSelect');
  const modeToggleBtn = document.getElementById('modeToggleBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const navLinks = Array.from(document.querySelectorAll('.nav-link-btn'));

  // Initialize
  function init() {
    // Set initial mode
    if (isPresentationMode) {
      document.body.classList.add('mode-presentation');
      if (modeToggleBtn) modeToggleBtn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        <span>Mode Web</span>
      `;
    } else {
      document.body.classList.remove('mode-presentation');
      if (modeToggleBtn) modeToggleBtn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
        <span>Mode Slide</span>
      `;
    }

    // Check URL Hash for initial slide
    const hash = window.location.hash;
    if (hash) {
      const idx = slides.findIndex(s => '#' + s.id === hash);
      if (idx !== -1) currentSlide = idx;
    }

    updateView(currentSlide, false);
    bindEvents();
  }

  // Update slide view
  function updateView(index, updateHash = true) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    currentSlide = index;

    // Update active slide class
    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
        if (!isPresentationMode) {
          slide.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        slide.classList.remove('active');
      }
    });

    const activeId = slides[currentSlide].id;

    // Update URL hash
    if (updateHash && history.pushState) {
      history.pushState(null, null, '#' + activeId);
    }

    // Update Progress Bar
    const percent = ((currentSlide + 1) / totalSlides) * 100;
    if (progressBar) progressBar.style.width = `${percent}%`;

    // Update Slide Counter
    if (slideCounter) {
      const cur = String(currentSlide + 1).padStart(2, '0');
      const tot = String(totalSlides).padStart(2, '0');
      slideCounter.textContent = `${cur} / ${tot}`;
    }

    // Update Quick Jump Select
    if (quickJumpSelect) {
      quickJumpSelect.value = currentSlide;
    }

    // Highlight floating bottom nav items
    updateNavHighlight(activeId);

    // Reset scroll position in presentation mode
    if (isPresentationMode) {
      const activeEl = slides[currentSlide];
      if (activeEl) activeEl.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  // Highlight navigation links
  function updateNavHighlight(id) {
    navLinks.forEach(link => {
      const target = link.getAttribute('data-target');
      if (!target) return;
      
      let match = false;
      if (target === id) {
        match = true;
      } else if (target === 'slide-refleksi-intro' && id.startsWith('slide-topik')) {
        match = true; // highlight REFLEKSI when viewing any topic
      }
      
      if (match) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Go to next slide
  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      updateView(currentSlide + 1);
    }
  }

  // Go to prev slide
  function prevSlide() {
    if (currentSlide > 0) {
      updateView(currentSlide - 1);
    }
  }

  // Toggle presentation vs web mode
  function toggleMode() {
    isPresentationMode = !isPresentationMode;
    if (isPresentationMode) {
      document.body.classList.add('mode-presentation');
      if (modeToggleBtn) modeToggleBtn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        <span>Mode Web</span>
      `;
      updateView(currentSlide, true);
    } else {
      document.body.classList.remove('mode-presentation');
      if (modeToggleBtn) modeToggleBtn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
        <span>Mode Slide</span>
      `;
      const currentEl = slides[currentSlide];
      if (currentEl) currentEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Fullscreen toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      if (fullscreenBtn) fullscreenBtn.classList.add('active');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        if (fullscreenBtn) fullscreenBtn.classList.remove('active');
      }
    }
  }

  // Bind all event listeners
  function bindEvents() {
    // Next / Prev buttons
    if (prevSlideBtn) prevSlideBtn.addEventListener('click', prevSlide);
    if (nextSlideBtn) nextSlideBtn.addEventListener('click', nextSlide);

    // Mode Toggle
    if (modeToggleBtn) modeToggleBtn.addEventListener('click', toggleMode);

    // Fullscreen Toggle
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Quick Jump dropdown
    if (quickJumpSelect) {
      quickJumpSelect.addEventListener('change', (e) => {
        updateView(parseInt(e.target.value, 10));
      });
    }

    // Bottom nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        const idx = slides.findIndex(s => s.id === targetId);
        if (idx !== -1) updateView(idx);
      });
    });

    // In-page navigation links (e.g. from Menu cards or Roadmap)
    document.addEventListener('click', (e) => {
      const targetAnchor = e.target.closest('a[data-jump]');
      if (targetAnchor) {
        e.preventDefault();
        const jumpId = targetAnchor.getAttribute('data-jump');
        const idx = slides.findIndex(s => s.id === jumpId);
        if (idx !== -1) updateView(idx);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ignore if typing inside input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case ' ': // Spacebar
          if (isPresentationMode) {
            e.preventDefault();
            nextSlide();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          updateView(0);
          break;
        case 'End':
          e.preventDefault();
          updateView(totalSlides - 1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMode();
          break;
      }
    });

    // Touch swipe gestures
    let touchStartX = 0;
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!isPresentationMode) return;
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe
      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });

    // Window scroll observer in web mode
    window.addEventListener('scroll', () => {
      if (isPresentationMode) return;
      const scrollPos = window.scrollY + window.innerHeight / 3;
      slides.forEach((slide, i) => {
        const top = slide.offsetTop;
        const height = slide.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSlide = i;
          if (slideCounter) {
            const cur = String(currentSlide + 1).padStart(2, '0');
            const tot = String(totalSlides).padStart(2, '0');
            slideCounter.textContent = `${cur} / ${tot}`;
          }
          if (quickJumpSelect) quickJumpSelect.value = currentSlide;
          updateNavHighlight(slide.id);
        }
      });
    }, { passive: true });
  }

  // Run initialization
  init();
});
