/**
 * DUDU HAUTE PARFUMERIE - Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initBoutiqueMapSync();
  initFragranceModals();
  initBookingModal();
  initNewsletterForm();
  initMobileMenu();
  initHeaderScrollEffect();
});

/* =========================================================================
   1. Smooth Scroll with Sticky Header Offset
   ========================================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          closeMobileMenu();
        }
      }
    });
  });
}

/* =========================================================================
   2. Boutique Map & Cards Interactive Synchronization
   ========================================================================= */
function initBoutiqueMapSync() {
  const pins = document.querySelectorAll('.map-pin');
  const cards = document.querySelectorAll('.boutique-card');

  function activateSalon(cityId) {
    // Update Pins
    pins.forEach(pin => {
      const pinCity = pin.getAttribute('data-city');
      const pingRing = pin.querySelector('.ping-ring');
      const pinDot = pin.querySelector('.pin-circle');
      
      if (pinCity === cityId) {
        pin.classList.add('active-pin');
        if (pingRing) pingRing.classList.remove('opacity-30', 'opacity-40');
        if (pingRing) pingRing.classList.add('opacity-70', 'scale-125');
        if (pinDot) pinDot.classList.add('bg-primary', 'ring-4', 'ring-primary-container/30');
      } else {
        pin.classList.remove('active-pin');
        if (pingRing) pingRing.classList.remove('opacity-70', 'scale-125');
        if (pingRing) pingRing.classList.add('opacity-30');
        if (pinDot) {
          pinDot.classList.remove('ring-4', 'ring-primary-container/30');
          if (pinCity !== 'warszawa') {
            pinDot.classList.remove('bg-primary');
            pinDot.classList.add('bg-secondary');
          }
        }
      }
    });

    // Update Cards
    cards.forEach(card => {
      const cardCity = card.getAttribute('data-city');
      if (cardCity === cityId) {
        card.classList.add('active-salon');
      } else {
        card.classList.remove('active-salon');
      }
    });
  }

  // Pin click event
  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      const city = pin.getAttribute('data-city');
      activateSalon(city);

      // Scroll card into view smoothly on smaller screens
      const targetCard = document.querySelector(`.boutique-card[data-city="${city}"]`);
      if (targetCard && window.innerWidth < 1024) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Card click or hover event
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const city = card.getAttribute('data-city');
      activateSalon(city);
    });
  });
}

/* =========================================================================
   3. Fragrance Olfactory Details Modal
   ========================================================================= */
const FRAGRANCE_DATA = {
  damska: {
    category: 'Kolekcja Damska',
    name: 'Fleur de Soie — Signature',
    concentration: 'Eau de Parfum • 28% koncentracji',
    description: 'Aura zmysłowej elegancji i delikatności. Kompozycja otwiera się promiennym akordem sycylijskiej bergamotki i nashi, by ustąpić miejsca sercu z ręcznie zbieranej róży damasceńskiej oraz białej piwonii.',
    topNotes: 'Sycylijska bergamotka, różowy pieprz, gruszka nashi',
    heartNotes: 'Biała piwonia, jaśmin wielkolistny sambac, róża damasceńska',
    baseNotes: 'Kremowe drzewo sandałowe z Mysore, białe piżmo, bursztyn kryształowy',
    longevity: '10-12 godzin',
    sillage: 'Subtelny z wyrazistym ogonem',
    sizes: '50ml (490 PLN) / 100ml (740 PLN)',
    img: 'assets/images/dla-niej.jpg',
    fallbackImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtv4SFbjtL-uKXz9GeLGWd4d6lvakbG0XCkF5qikRvP1jlgAPDB7AiOjQ3DvlBiGIc3K6iThpmXv1fsZZPPQYlOb4S_cPo_HOFtg0rQ2f2paEgG0bskoJ7_5vUzRjkD9kla9B3b1-KyNCFZ58JMtzE4d_XcJ0sFP57v6J_qc5V1akEugP1AhXyM25goWjZGYrKfVYbSQazOnYOP__Uyg0NCwCaq7bWJhyNiQLqAy4wSS3Y1ooGFQyM6g'
  },
  meska: {
    category: 'Kolekcja Męska',
    name: 'Ombre de Cèdre — Noir',
    concentration: 'Eau de Parfum • 28% koncentracji',
    description: 'Zapach siły, tajemnicy i spokoju. Głęboki akord dymnego drewna cedrowego z gór Atlas spleciony z pieprzem madagaskarskim oraz żywicznym, ciepłym bursztynem.',
    topNotes: 'Czarny pieprz z Madagaskaru, rześka włoska bergamotka, zielony kardamon',
    heartNotes: 'Wędzona paczula, suchy irys florencki, liście szlachetnego tytoniu',
    baseNotes: 'Dymny cedr atlaski, wetyweria haitańska, płynny złoty bursztyn',
    longevity: '12-14 godzin',
    sillage: 'Mocny, magnetyczny',
    sizes: '50ml (490 PLN) / 100ml (740 PLN)',
    img: 'assets/images/dla-niego.jpg',
    fallbackImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvJDH9JCfaJuyTGuXQdgh-A_UTfhN6n1se0XMk7wVtC-zr1JXiwXB5f3NT4SuW20LSg_AbytAY9w_nlcs-Qyhc-hKEZg2_zjHM2IQH0iMcFBZ_5NL6gDH8yXsMrb7Hsp8Y6iTCr2gdkv1UCM0_vmFR9XwmhuGL2AGBhwGEX8ViHK3xG9FPXZu1gkR3nE4jYdgOZAxUzMQt27qfl70xF2pmcjdBfL6D1BOhrlGScQ42reFY_DWBnJJ3hw'
  },
  unisex: {
    category: 'Unisex & Discovery',
    name: 'Santal & Figue — Infini',
    concentration: 'Extrait de Parfum • 30% koncentracji',
    description: 'Harmonijna symfonia bez ograniczeń płciowych. Dojrzała, mleczna figa spotyka się z aksamitnym kaszmirem, czystym białym piżmem oraz chłodnym akordem kardamonu.',
    topNotes: 'Liście śródziemnomorskiej figi, kardamon gwatemalski, dojrzała mandarynka',
    heartNotes: 'Pudrowy dziki irys, herbata Earl Grey, mleczko figowe, korzeń fiołka',
    baseNotes: 'Kaszmirowe białe piżmo, cedr virginia, solony mech dębowy',
    longevity: '12-16 godzin',
    sillage: 'Otulający, intymny',
    sizes: '50ml (520 PLN) / 100ml (790 PLN)',
    img: 'assets/images/uniwersalne.jpg',
    fallbackImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8V6ZPhGxJTX7_7qYl1XvkUxl_9_2XkEG5C7OTskAr89lg9I0l8v4I2FsggGEWXh1P2SkqPv2KjAqy3-v7VCMulig9mgiX97mR5DcqjO7GVvecSJEpJdYpGmStTJZ1RplCnyscKeo3FqktyBIAfkKmOydSTHI24rfXRJkPxcxtwAaXJKD9bFNS_AO6iorof2w4TVJx-J-v8-kXoiTwkGOVt92zmywPtugT6RCQ10W_QOiTj3rwrWaxng'
  }
};

function initFragranceModals() {
  const modal = document.getElementById('fragrance-modal');
  const closeBtn = document.getElementById('close-fragrance-modal');
  const triggerBtns = document.querySelectorAll('[data-fragrance-trigger]');

  if (!modal) return;

  function openFragrance(type) {
    const data = FRAGRANCE_DATA[type];
    if (!data) return;

    document.getElementById('modal-frag-cat').textContent = data.category;
    document.getElementById('modal-frag-name').textContent = data.name;
    document.getElementById('modal-frag-conc').textContent = data.concentration;
    document.getElementById('modal-frag-desc').textContent = data.description;
    document.getElementById('modal-frag-top').textContent = data.topNotes;
    document.getElementById('modal-frag-heart').textContent = data.heartNotes;
    document.getElementById('modal-frag-base').textContent = data.baseNotes;
    document.getElementById('modal-frag-long').textContent = data.longevity;
    document.getElementById('modal-frag-sizes').textContent = data.sizes;

    const imgElem = document.getElementById('modal-frag-img');
    if (imgElem) {
      imgElem.src = data.img;
      imgElem.onerror = () => { imgElem.src = data.fallbackImg; };
    }

    modal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('modal-hidden');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const type = btn.getAttribute('data-fragrance-trigger');
      openFragrance(type);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('modal-hidden')) {
      closeModal();
    }
  });
}

/* =========================================================================
   4. Appointment / Consultation Booking Modal
   ========================================================================= */
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const openBtns = document.querySelectorAll('[data-booking-trigger]');
  const closeBtn = document.getElementById('close-booking-modal');
  const form = document.getElementById('booking-form');

  if (!modal) return;

  function openBooking(salonDefault = 'warszawa') {
    const salonSelect = document.getElementById('booking-salon-select');
    if (salonSelect && salonDefault) {
      salonSelect.value = salonDefault;
    }
    // Set default minimum date as tomorrow
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
      if (!dateInput.value) {
        dateInput.value = tomorrow.toISOString().split('T')[0];
      }
    }

    modal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeBooking() {
    modal.classList.add('modal-hidden');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const salon = btn.getAttribute('data-booking-salon') || 'warszawa';
      openBooking(salon);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeBooking);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
      closeBooking();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('modal-hidden')) {
      closeBooking();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('booking-name').value.trim();
      const salon = document.getElementById('booking-salon-select').options[document.getElementById('booking-salon-select').selectedIndex].text;
      
      closeBooking();
      form.reset();

      showToast(`Dziękujemy ${name}! Twoja wizyta w salonie ${salon} została zarezerwowana. Potwierdzenie wysłaliśmy SMS-em.`, 'success');
    });
  }
}

/* =========================================================================
   5. Newsletter Form & Toasts
   ========================================================================= */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : '';

      if (email) {
        showToast(`Witamy w Klubie Olfaktorycznym DUDU! Sprawdź e-mail (${email}) z kodem na próbkę powitalną 5ml.`, 'success');
        form.reset();
      }
    });
  }
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-primary">
      <span class="material-symbols-outlined text-[18px]">verified</span>
    </div>
    <div class="flex-grow">
      <p class="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold mb-0.5">DUDU Haute Parfumerie</p>
      <p class="font-body-sm text-[13px] text-on-surface leading-snug">${message}</p>
    </div>
    <button type="button" class="text-on-surface-variant hover:text-primary transition-colors p-1" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined text-[16px]">close</span>
    </button>
  `;

  container.appendChild(toast);

  // Trigger entrance transition
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

/* =========================================================================
   6. Mobile Navigation Drawer
   ========================================================================= */
function initMobileMenu() {
  const burgerBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('close-mobile-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (!burgerBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    requestAnimationFrame(() => {
      backdrop.classList.add('opacity-100');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-100');
    setTimeout(() => {
      backdrop.classList.add('hidden');
    }, 350);
    document.body.style.overflow = '';
  }

  burgerBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  window.closeMobileMenu = closeMenu;
}

/* =========================================================================
   7. Header Scroll Shadow & Blur Effect
   ========================================================================= */
function initHeaderScrollEffect() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-md', 'bg-surface-container-lowest/95');
      header.classList.remove('bg-surface-container-lowest/80');
    } else {
      header.classList.remove('shadow-md', 'bg-surface-container-lowest/95');
      header.classList.add('bg-surface-container-lowest/80');
    }
  });
}
