/**
 * Sakthi Dental Clinic - Main JavaScript Engine
 * Client: Sakthi Dental Clinic (Hosur, Tamil Nadu)
 * Features: Mobile Menu, Interactive Booking Modal, Real-time Validation,
 *           FAQ Accordions, Treatment Filters, Dynamic Search, Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initAppointmentModal();
  initContactForm();
  initTreatmentFilters();
  initFaqAccordion();
  initBackToTop();
  setupSmoothScroll();
});

/* ==========================================================================
   1. Mobile Offcanvas Navigation
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   2. Sticky Header & Back to Top Indicator
   ========================================================================== */
function initStickyHeader() {
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (navbar) {
      if (scrollPos > 40) {
        navbar.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.1)';
      } else {
        navbar.style.boxShadow = '0 2px 14px rgba(15, 23, 42, 0.05)';
      }
    }

    if (backToTop) {
      if (scrollPos > 350) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });
}

function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   3. Interactive Appointment Booking Modal
   ========================================================================== */
function initAppointmentModal() {
  const modal = document.getElementById('appointment-modal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('[data-open-modal="appointment-modal"]');
  const closeBtns = modal.querySelectorAll('[data-close-modal]');
  const form = document.getElementById('appointment-form');
  const treatmentSelect = document.getElementById('appt-treatment');
  const doctorSelect = document.getElementById('appt-doctor');
  const dateInput = document.getElementById('appt-date');
  const slotButtons = modal.querySelectorAll('.time-slot-btn');
  const selectedSlotInput = document.getElementById('appt-slot');
  const modalContent = modal.querySelector('.modal-body');

  // Restrict appointment dates to today onwards
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  // Handle slot selection pills
  slotButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      slotButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (selectedSlotInput) {
        selectedSlotInput.value = btn.getAttribute('data-slot');
      }
    });
  });

  function openAppointmentModal(treatmentName = '', doctorName = '') {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (treatmentName && treatmentSelect) {
      for (let option of treatmentSelect.options) {
        if (option.value.toLowerCase().includes(treatmentName.toLowerCase()) || 
            treatmentName.toLowerCase().includes(option.value.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }

    if (doctorName && doctorSelect) {
      for (let option of doctorSelect.options) {
        if (option.value.toLowerCase().includes(doctorName.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }
  }

  function closeAppointmentModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const treatment = btn.getAttribute('data-treatment') || '';
      const doctor = btn.getAttribute('data-doctor') || '';
      openAppointmentModal(treatment, doctor);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeAppointmentModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAppointmentModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeAppointmentModal();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('appt-name').value.trim();
      const phone = document.getElementById('appt-phone').value.trim();
      const email = document.getElementById('appt-email').value.trim();
      const treatment = treatmentSelect ? treatmentSelect.value : 'General Dental Consultation';
      const doctor = doctorSelect ? doctorSelect.value : 'Dr. Anupriya (Chief Consultant)';
      const date = dateInput ? dateInput.value : 'Tomorrow';
      const slot = selectedSlotInput ? selectedSlotInput.value : 'Morning (9:00 AM - 12:00 PM)';

      if (!name || !phone) {
        showToast('Please provide your name and contact phone number', 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Booking Appointment...</span>';

      setTimeout(() => {
        const bookingId = 'SDC-' + Math.floor(100000 + Math.random() * 900000);

        modalContent.innerHTML = `
          <div style="text-align: center; padding: 25px 15px;">
            <div style="width: 72px; height: 72px; background: #ECFDF5; color: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; border: 2px solid #A7F3D0;">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 style="font-size: 1.5rem; color: #0F172A; margin-bottom: 8px;">Appointment Confirmed!</h3>
            <p style="color: #64748B; font-size: 0.95rem; margin-bottom: 22px;">Thank you, <strong>${escapeHtml(name)}</strong>. Your appointment request has been scheduled with Sakthi Dental Clinic.</p>
            
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; text-align: left; margin-bottom: 24px; font-size: 0.9rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #CBD5E1; padding-bottom: 8px;">
                <span style="color: #64748B;">Appointment ID:</span>
                <strong style="color: #6D28D9;">${bookingId}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #64748B;">Treatment:</span>
                <strong style="color: #0F172A;">${escapeHtml(treatment)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #64748B;">Doctor:</span>
                <strong style="color: #0F172A;">${escapeHtml(doctor)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #64748B;">Date:</span>
                <strong style="color: #0F172A;">${escapeHtml(date)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748B;">Preferred Slot:</span>
                <strong style="color: #059669;">${escapeHtml(slot)}</strong>
              </div>
            </div>

            <p style="font-size: 0.82rem; color: #64748B; margin-bottom: 24px;">Our desk coordinator will reach you at <strong>${escapeHtml(phone)}</strong> shortly for token verification.</p>
            
            <div style="display: flex; gap: 12px; justify-content: center;">
              <button onclick="window.print()" class="btn btn-secondary btn-sm">Print Slip</button>
              <button data-close-modal class="btn btn-primary btn-sm">Done</button>
            </div>
          </div>
        `;

        modal.querySelectorAll('[data-close-modal]').forEach(b => {
          b.addEventListener('click', closeAppointmentModal);
        });

        showToast('Appointment successfully booked! ID: ' + bookingId, 'success');
      }, 700);
    });
  }
}

/* ==========================================================================
   4. Contact Us Form Real-Time Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const messageInput = document.getElementById('contact-message');
  const successBox = document.getElementById('contact-success-msg');

  function validateField(input, condition) {
    if (!condition) {
      input.classList.add('is-invalid');
      return false;
    } else {
      input.classList.remove('is-invalid');
      return true;
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+ ]{8,15}$/;

  nameInput?.addEventListener('input', () => {
    validateField(nameInput, nameInput.value.trim().length >= 2);
  });

  emailInput?.addEventListener('input', () => {
    validateField(emailInput, emailRegex.test(emailInput.value.trim()));
  });

  phoneInput?.addEventListener('input', () => {
    validateField(phoneInput, phoneRegex.test(phoneInput.value.trim()));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2);
    const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()));
    const isPhoneValid = validateField(phoneInput, phoneRegex.test(phoneInput.value.trim()));

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      showToast('Please correct the highlighted errors in the form.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Message...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (successBox) {
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      showToast('Thank you! Your message has been sent to Sakthi Dental Clinic.', 'success');
    }, 700);
  });
}

/* ==========================================================================
   5. Treatments Page Filters & Search
   ========================================================================== */
function initTreatmentFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const treatmentCards = document.querySelectorAll('.treatment-card');
  const searchInput = document.getElementById('treatment-search');
  const countDisplay = document.getElementById('treatment-count');

  if (!filterButtons.length && !treatmentCards.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilter() {
    let visibleCount = 0;

    treatmentCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || 'all';
      const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('p')?.textContent || '').toLowerCase();

      const matchesCat = (currentCategory === 'all') || (cardCategory === currentCategory);
      const matchesSearch = (!searchQuery) || title.includes(searchQuery) || desc.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `Showing ${visibleCount} treatments`;
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilter();
    });
  }
}

/* ==========================================================================
   6. FAQ Accordion & Search
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearch = document.getElementById('faq-search');

  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close others if single open style preferred
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      faqItems.forEach(item => {
        const question = (item.querySelector('.faq-header')?.textContent || '').toLowerCase();
        const answer = (item.querySelector('.faq-body')?.textContent || '').toLowerCase();

        if (!query || question.includes(query) || answer.includes(query)) {
          item.style.display = 'block';
          if (query) item.classList.add('active');
        } else {
          item.style.display = 'none';
          item.classList.remove('active');
        }
      });
    });
  }
}

/* ==========================================================================
   7. Toast Notification Utility
   ========================================================================== */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconSvg = type === 'success' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    <div style="flex-shrink: 0;">${iconSvg}</div>
    <div style="font-size: 0.9rem; color: #1E293B; font-weight: 500;">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ==========================================================================
   8. Smooth Internal Links Scroll
   ========================================================================== */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

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

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
