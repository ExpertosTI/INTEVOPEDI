document.addEventListener('DOMContentLoaded', () => {
  let deck = null;
  if (window.Reveal) {
    deck = new Reveal({
      hash: true,
      slideNumber: true,
      controls: true,
      progress: true,
      center: true,
      transition: 'slide'
    });
    deck.initialize();
  }

  const quizzes = document.querySelectorAll('.quiz');
  quizzes.forEach(quiz => {
    const options = quiz.querySelectorAll('.quiz-option');
    const feedback = quiz.querySelector('.quiz-feedback');
    options.forEach(option => {
      option.addEventListener('click', () => {
        const isCorrect = option.getAttribute('data-correct') === 'true';
        options.forEach(o => { o.style.backgroundColor = ''; });
        if (isCorrect) {
          option.style.backgroundColor = '#38ef7d';
          if (feedback) { feedback.textContent = 'Correcto, muy bien.'; feedback.style.color = '#11998e'; }
        } else {
          option.style.backgroundColor = '#EB3349';
          if (feedback) { feedback.textContent = 'Revisa nuevamente el contenido del módulo.'; feedback.style.color = '#EB3349'; }
        }
      });
    });
  });

  const slidesRoot = document.getElementById('slides');
  const sideNav = document.getElementById('side-nav-modules');
  const progressBar = document.getElementById('course-progress-bar');
  const progressText = document.getElementById('course-progress-text');

  if (!slidesRoot) return;

  const moduleSections = [];
  Array.from(slidesRoot.children).forEach((sec, idx) => {
    if (!(sec instanceof HTMLElement) || sec.tagName !== 'SECTION') return;
    const h2 = sec.querySelector('h2');
    if (!h2) return;
    const text = h2.textContent.trim();
    const match = text.match(/^Módulo\s+(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      const id = `mod-${num}`;
      sec.id = id;
      moduleSections.push({ id, num, index: idx, title: text });
    }
  });

  if (sideNav) {
    moduleSections.forEach(m => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${m.id}`;
      a.textContent = m.title;
      a.dataset.target = m.id;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.dataset.target;
        const sectionIndex = moduleSections.find(s => s.id === targetId)?.index;
        if (deck && typeof sectionIndex === 'number') {
          deck.slide(sectionIndex, 0, 0);
        } else {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      });
      li.appendChild(a);
      sideNav.appendChild(li);
    });
  }

  const updateProgress = () => {
    const total = moduleSections.length || 16;
    let completed = 0;
    moduleSections.forEach(m => {
      const key = `course_mod_${m.num}`;
      if (localStorage.getItem(key) === 'true') {
        completed++;
        const sec = document.getElementById(m.id);
        if (sec) sec.classList.add('module-completed');
      }
    });
    const pct = total ? Math.round((completed / total) * 100) : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `Progreso: ${pct}% (${completed}/${total})`;
  };

  moduleSections.forEach(m => {
    const sec = document.getElementById(m.id);
    if (!sec) return;
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Marcar módulo completado';
    btn.setAttribute('aria-label', `Marcar módulo ${m.num} completado`);
    btn.style.margin = '10px 0';
    btn.addEventListener('click', () => {
      localStorage.setItem(`course_mod_${m.num}`, 'true');
      updateProgress();
    });
    const h2 = sec.querySelector('h2');
    if (h2) h2.insertAdjacentElement('afterend', btn);
  });

  updateProgress();

  const bpmInput = document.getElementById('metronome-bpm');
  const toggleBtn = document.getElementById('metronome-toggle');
  const visual = document.getElementById('metronome-visual');
  const metroBar = visual ? visual.querySelector('.metro-bar') : null;
  let metroTimer = null;

  const startMetronome = () => {
    const bpm = Math.max(40, Math.min(220, parseInt(bpmInput.value || '120', 10)));
    const interval = (60 * 1000) / bpm;
    stopMetronome();
    metroTimer = setInterval(() => {
      if (metroBar) {
        metroBar.style.width = '100%';
        setTimeout(() => { metroBar.style.width = '0%'; }, 60);
      }
    }, interval);
    toggleBtn.textContent = 'Detener';
  };

  const stopMetronome = () => {
    if (metroTimer) {
      clearInterval(metroTimer);
      metroTimer = null;
      if (metroBar) metroBar.style.width = '0%';
    }
    toggleBtn.textContent = 'Iniciar';
  };

  if (toggleBtn && bpmInput) {
    toggleBtn.addEventListener('click', () => {
      if (metroTimer) stopMetronome();
      else startMetronome();
    });
  }
});
