const slides = Array.from(document.querySelectorAll('.slide'));
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let activeTimers = [];

function clearAnimationTimers() {
  activeTimers.forEach(timer => clearTimeout(timer));
  activeTimers = [];
}

function animateSlide(slide) {
  clearAnimationTimers();

  slides.forEach((item) => {
    item.querySelectorAll('.is-in').forEach(el => el.classList.remove('is-in'));
  });

  const targets = slide.querySelectorAll(
    '.slide-head > *, .title-block > *, .hero-copy > *, .hero-side > *, .cover-meta, .cover-system, .support-card, .cover-summary, .glass, .story-arrow, .metric-band > div'
  );

  const uniqueTargets = [...new Set(Array.from(targets))];
  uniqueTargets.forEach((target, index) => {
    const timer = setTimeout(() => {
      target.classList.add('is-in');
    }, 80 + index * 70);
    activeTimers.push(timer);
  });
}

function updateProgress() {
  progressText.textContent = `${currentIndex + 1} / ${slides.length}`;
  progressFill.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
}

function showSlide(index) {
  currentIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentIndex);
  });

  updateProgress();
  document.title = `${slides[currentIndex].dataset.title} · Wallpaper Gallery 架构汇报`;
  animateSlide(slides[currentIndex]);
}

prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

window.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    showSlide(currentIndex + 1);
  }

  if (['ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    showSlide(currentIndex - 1);
  }

  if (event.key === 'Home') {
    event.preventDefault();
    showSlide(0);
  }

  if (event.key === 'End') {
    event.preventDefault();
    showSlide(slides.length - 1);
  }
});

showSlide(0);
