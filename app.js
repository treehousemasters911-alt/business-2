/* =======================================================
   DIGITAL GIFT FOR GIRLFRIEND - INTERACTIVE ENGINE
   ======================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------------------------------
  // 1. PAGE NAVIGATION LOGIC (5 PAGES)
  // -----------------------------------------------------
  let currentPage = 1;
  const totalPages = 5;
  const pages = document.querySelectorAll('.gift-page');
  const dotBtns = document.querySelectorAll('.dot-btn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const startJourneyBtn = document.getElementById('startJourneyBtn');
  const restartBtn = document.getElementById('restartBtn');

  function updateNav() {
    pages.forEach((page, idx) => {
      const pageNum = idx + 1;
      page.classList.remove('active', 'prev-out', 'next-out');
      if (pageNum === currentPage) {
        page.classList.add('active');
      } else if (pageNum < currentPage) {
        page.classList.add('prev-out');
      } else {
        page.classList.add('next-out');
      }
    });

    dotBtns.forEach((dot, idx) => {
      dot.classList.toggle('active', idx + 1 === currentPage);
    });

    if (prevBtn) {
      prevBtn.style.opacity = currentPage === 1 ? '0.35' : '1';
      prevBtn.style.pointerEvents = currentPage === 1 ? 'none' : 'auto';
    }
    if (nextBtn) {
      nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
    }
  }

  function goToPage(targetPage) {
    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;
    currentPage = targetPage;
    updateNav();
  }

  function nextPage() {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', prevPage);
  if (nextBtn) nextBtn.addEventListener('click', nextPage);

  dotBtns.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-page'));
      goToPage(target);
    });
  });

  if (startJourneyBtn) {
    startJourneyBtn.addEventListener('click', () => {
      const env = document.getElementById('envelope');
      if (env && !env.classList.contains('open')) {
        env.classList.add('open');
        triggerConfetti(50);
        playNoteSound(523.25); // C5
      }
      setTimeout(() => goToPage(2), 650);
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => goToPage(1));
  }

  // Keyboard navigation for desktop testing
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
  });

  // Mobile Touch Swipe Handling
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  const slider = document.getElementById('giftSlider');
  if (slider) {
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    }, { passive: true });
  }

  function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    // Ensure horizontal swipe is dominant and above threshold (40px)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
  }

  // -----------------------------------------------------
  // 2. PAGE 1: ENVELOPE UNWRAPPING
  // -----------------------------------------------------
  const envelopeTrigger = document.getElementById('envelopeTrigger');
  const envelope = document.getElementById('envelope');

  if (envelopeTrigger && envelope) {
    envelopeTrigger.addEventListener('click', () => {
      envelope.classList.toggle('open');
      if (envelope.classList.contains('open')) {
        triggerConfetti(60);
        playChimeArpeggio();
        startMusic();
      }
    });
  }

  // -----------------------------------------------------
  // 3. PAGE 2: SCRAPBOOK INTERACTIVE PINS
  // -----------------------------------------------------
  const memoryPins = document.querySelectorAll('.memory-pin');
  const pinCaptionText = document.getElementById('pinCaptionText');
  const pinCaptionBox = document.getElementById('pinCaptionBox');

  memoryPins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const caption = pin.getAttribute('data-caption');
      if (pinCaptionText && caption) {
        pinCaptionText.style.opacity = '0';
        setTimeout(() => {
          pinCaptionText.textContent = caption;
          pinCaptionText.style.opacity = '1';
        }, 150);
      }
      if (pinCaptionBox) {
        pinCaptionBox.style.transform = 'scale(1.04)';
        setTimeout(() => { pinCaptionBox.style.transform = 'scale(1)'; }, 200);
      }
      playNoteSound(659.25); // E5
    });
  });

  // Tap anywhere on collage card to spawn a sweet floating heart
  const collageCard = document.getElementById('collageCard');
  if (collageCard) {
    collageCard.addEventListener('click', (e) => {
      const rect = collageCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnClickHeart(x, y, collageCard);
    });
  }

  function spawnClickHeart(x, y, parent) {
    const heart = document.createElement('span');
    heart.textContent = '❤️';
    heart.style.position = 'absolute';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.pointerEvents = 'none';
    heart.style.fontSize = '20px';
    heart.style.transform = 'translate(-50%, -50%) scale(0.5)';
    heart.style.transition = 'all 0.8s ease-out';
    heart.style.zIndex = '50';
    parent.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = 'translate(-50%, -80px) scale(1.4)';
      heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 800);
  }

  // -----------------------------------------------------
  // 4. PAGE 3: VINTAGE PHOTO STRIP (FILLED FRAMES & CUSTOM UPLOADS)
  // -----------------------------------------------------
  const photoSlots = [
    { slot: document.getElementById('slot-1'), input: document.getElementById('slotInput-1'), img: document.getElementById('slotImg-1'), key: 'digital_gift_photo_1' },
    { slot: document.getElementById('slot-2'), input: document.getElementById('slotInput-2'), img: document.getElementById('slotImg-2'), key: 'digital_gift_photo_2' },
    { slot: document.getElementById('slot-3'), input: document.getElementById('slotInput-3'), img: document.getElementById('slotImg-3'), key: 'digital_gift_photo_3' }
  ];

  photoSlots.forEach(item => {
    if (!item.slot || !item.input || !item.img) return;

    // Load saved custom photo from localStorage if present
    const saved = localStorage.getItem(item.key);
    if (saved) {
      item.img.src = saved;
    }

    // Click slot to trigger file picker
    item.slot.addEventListener('click', () => {
      item.input.click();
    });

    // Handle user photo selection
    item.input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const result = loadEvt.target.result;
          item.img.src = result;
          try {
            localStorage.setItem(item.key, result);
          } catch (err) {
            console.warn('Storage full for base64 image', err);
          }
          triggerConfetti(25);
          playNoteSound(783.99); // G5
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // -----------------------------------------------------
  // 5. PAGE 4: LOVE COUPONS REDEEM LOGIC
  // -----------------------------------------------------
  window.redeemCoupon = function(button, couponTitle) {
    const ticket = button.closest('.coupon-ticket');
    if (!ticket || ticket.classList.contains('redeemed')) return;

    ticket.classList.add('redeemed');
    button.classList.add('done');
    button.innerHTML = '<span>Redeemed ✓</span>';

    // Add Red Wax Stamp overlay
    const stamp = document.createElement('div');
    stamp.className = 'stamp-seal';
    stamp.textContent = 'REDEEMED ❤️';
    ticket.appendChild(stamp);

    playNoteSound(880.00); // A5
    triggerConfetti(35);

    // Save redeemed state
    const couponId = ticket.getAttribute('data-coupon');
    if (couponId) {
      localStorage.setItem(`digital_gift_coupon_${couponId}`, 'redeemed');
    }
  };

  // Restore coupon states
  document.querySelectorAll('.coupon-ticket').forEach(ticket => {
    const couponId = ticket.getAttribute('data-coupon');
    if (couponId && localStorage.getItem(`digital_gift_coupon_${couponId}`) === 'redeemed') {
      ticket.classList.add('redeemed');
      const btn = ticket.querySelector('.redeem-btn');
      if (btn) {
        btn.classList.add('done');
        btn.innerHTML = '<span>Redeemed ✓</span>';
      }
      const stamp = document.createElement('div');
      stamp.className = 'stamp-seal';
      stamp.textContent = 'REDEEMED ❤️';
      ticket.appendChild(stamp);
    }
  });

  // -----------------------------------------------------
  // 6. PAGE 5: BIRTHDAY CAKE & FLAME BLOWOUT
  // -----------------------------------------------------
  const flame = document.getElementById('flame');
  const smoke = document.getElementById('smoke');
  const blowHint = document.getElementById('blowHint');
  const cakeContainer = document.getElementById('cakeContainer');
  const finaleLetter = document.getElementById('finaleLetter');
  const relightBtn = document.getElementById('relightBtn');
  let isBlown = false;

  function blowOutCandle() {
    if (isBlown) return;
    isBlown = true;

    if (flame) flame.classList.add('blown-out');
    if (smoke) {
      smoke.classList.add('active');
      setTimeout(() => smoke.classList.remove('active'), 1200);
    }
    if (blowHint) {
      blowHint.innerHTML = '<span>✨ Your wish is on its way! ✨</span>';
      blowHint.style.background = '#eaf7ea';
      blowHint.style.color = '#2e7d32';
    }

    // Big confetti explosion!
    triggerConfetti(120);
    playCelebrationMelody();

    // Emphasize the love letter
    if (finaleLetter) {
      finaleLetter.style.transform = 'scale(1.02)';
      setTimeout(() => { finaleLetter.style.transform = 'scale(1)'; }, 300);
    }
  }

  if (flame) flame.addEventListener('click', blowOutCandle);
  if (cakeContainer) cakeContainer.addEventListener('click', blowOutCandle);

  if (relightBtn) {
    relightBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isBlown = false;
      if (flame) flame.classList.remove('blown-out');
      if (blowHint) {
        blowHint.innerHTML = '<span>💨 Tap the flame to blow!</span>';
        blowHint.style.background = '#fff0f4';
        blowHint.style.color = 'var(--primary-dark)';
      }
      playNoteSound(659.25);
    });
  }

  // Custom love letter editing modal
  const editLetterBtn = document.getElementById('editLetterBtn');
  const customNoteModal = document.getElementById('customNoteModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const saveModalBtn = document.getElementById('saveModalBtn');
  const customNoteInput = document.getElementById('customNoteInput');
  const letterBodyText = document.getElementById('letterBodyText');

  // Load custom letter if saved
  const savedLetter = localStorage.getItem('digital_gift_letter');
  if (savedLetter && letterBodyText) {
    letterBodyText.innerHTML = savedLetter.replace(/\n/g, '<br>');
  }

  if (editLetterBtn && customNoteModal && customNoteInput && letterBodyText) {
    editLetterBtn.addEventListener('click', () => {
      customNoteInput.value = letterBodyText.innerText;
      customNoteModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => {
      customNoteModal.classList.remove('open');
    });

    saveModalBtn.addEventListener('click', () => {
      const newText = customNoteInput.value.trim();
      if (newText) {
        letterBodyText.innerHTML = newText.replace(/\n/g, '<br>');
        localStorage.setItem('digital_gift_letter', newText);
      }
      customNoteModal.classList.remove('open');
      playNoteSound(587.33); // D5
    });

    customNoteModal.addEventListener('click', (e) => {
      if (e.target === customNoteModal) {
        customNoteModal.classList.remove('open');
      }
    });
  }

  // -----------------------------------------------------
  // 7. WEB AUDIO API ROMANTIC MELODY SYNTHESIZER
  // -----------------------------------------------------
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicInterval = null;
  const audioToggle = document.getElementById('audioToggle');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.5, gainVal = 0.15) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  function playNoteSound(freq) {
    initAudio();
    playTone(freq, 'sine', 0.6, 0.12);
  }

  function playChimeArpeggio() {
    initAudio();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'triangle', 0.8, 0.1), idx * 140);
    });
  }

  function playCelebrationMelody() {
    initAudio();
    const melody = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    melody.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'sine', 1.0, 0.15), idx * 110);
    });
  }

  // Dreamy lullaby / music-box arpeggios
  const sweetMelodyNotes = [
    523.25, 659.25, 783.99, 659.25, // C - E - G - E
    587.33, 698.46, 880.00, 698.46, // D - F - A - F
    659.25, 783.99, 987.77, 783.99, // E - G - B - G
    523.25, 659.25, 783.99, 1046.50 // C - E - G - C(high)
  ];
  let noteIndex = 0;

  function startMusic() {
    initAudio();
    if (isMusicPlaying) return;
    isMusicPlaying = true;
    if (audioToggle) audioToggle.classList.add('playing');

    musicInterval = setInterval(() => {
      if (!isMusicPlaying) return;
      const freq = sweetMelodyNotes[noteIndex % sweetMelodyNotes.length];
      playTone(freq, 'sine', 0.9, 0.08);
      noteIndex++;
    }, 450);
  }

  function stopMusic() {
    isMusicPlaying = false;
    if (musicInterval) clearInterval(musicInterval);
    if (audioToggle) audioToggle.classList.remove('playing');
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (isMusicPlaying) {
        stopMusic();
      } else {
        startMusic();
      }
    });
  }

  // -----------------------------------------------------
  // 8. CANVAS FLOATING HEARTS (BACKGROUND)
  // -----------------------------------------------------
  const heartsCanvas = document.getElementById('heartsCanvas');
  if (heartsCanvas) {
    const ctx = heartsCanvas.getContext('2d');
    let width = heartsCanvas.width = window.innerWidth;
    let height = heartsCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = heartsCanvas.width = window.innerWidth;
      height = heartsCanvas.height = window.innerHeight;
    });

    const hearts = [];
    const colors = ['rgba(230,92,123,0.3)', 'rgba(255,182,193,0.35)', 'rgba(249,211,113,0.35)', 'rgba(255,255,255,0.4)'];

    for (let i = 0; i < 22; i++) {
      hearts.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 360,
        spin: (Math.random() - 0.5) * 0.02
      });
    }

    function drawHeart(ctx, x, y, size, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.2);
      // bottom right curve
      ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function animateHearts() {
      ctx.clearRect(0, 0, width, height);
      hearts.forEach(h => {
        h.y -= h.speedY;
        h.x += h.speedX;
        h.angle += h.spin;

        if (h.y < -30) {
          h.y = height + 20;
          h.x = Math.random() * width;
        }
        if (h.x < -30) h.x = width + 20;
        if (h.x > width + 30) h.x = -20;

        drawHeart(ctx, h.x, h.y, h.size, h.color);
      });
      requestAnimationFrame(animateHearts);
    }
    animateHearts();
  }

  // -----------------------------------------------------
  // 9. CANVAS CELEBRATORY CONFETTI ENGINE
  // -----------------------------------------------------
  const confettiCanvas = document.getElementById('confettiCanvas');
  let confettiParticles = [];
  let confettiAnimationId = null;

  function triggerConfetti(count = 70) {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    const width = confettiCanvas.width = window.innerWidth;
    const height = confettiCanvas.height = window.innerHeight;

    const confColors = ['#e65c7b', '#ffd5df', '#f9d371', '#7ba4cf', '#ffffff', '#ff8da1', '#ff5100'];

    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: width / 2 + (Math.random() - 0.5) * 100,
        y: height / 2 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.2) * 14,
        size: Math.random() * 8 + 6,
        color: confColors[Math.floor(Math.random() * confColors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!confettiAnimationId) {
      renderConfetti(ctx, width, height);
    }
  }

  function renderConfetti(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.rotSpeed;
      p.opacity -= 0.012;

      if (p.opacity <= 0 || p.y > height + 20) {
        confettiParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.opacity);

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      ctx.restore();
    }

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(() => renderConfetti(ctx, width, height));
    } else {
      confettiAnimationId = null;
      ctx.clearRect(0, 0, width, height);
    }
  }
});
