// ==========================================================================
// Nail n Lash Studio & Academy — Interactive Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initLiveStatus();
  initServiceTabs();
  initBookingModal();
  initAcademyModal();
  initCopyAddress();
  initMobileNav();
});

// 1. Live Operating Status (10:00 AM - 7:30 PM IST)
function initLiveStatus() {
  const statusBadge = document.getElementById('live-status-pill');
  if (!statusBadge) return;

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeVal = currentHours * 60 + currentMinutes;

  const openTimeVal = 10 * 60; // 10:00 AM
  const closeTimeVal = 19 * 60 + 30; // 7:30 PM

  const isOpen = currentTimeVal >= openTimeVal && currentTimeVal < closeTimeVal;

  if (isOpen) {
    statusBadge.innerHTML = `
      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-status-dot"></span>
        Open Today · 10:00 AM – 7:30 PM
      </span>
    `;
  } else {
    statusBadge.innerHTML = `
      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
        Closed Now · Opens 10:00 AM Tomorrow
      </span>
    `;
  }
}

// 2. Service Tab Switching
function initServiceTabs() {
  const tabButtons = document.querySelectorAll('.service-tab');
  const serviceCards = document.querySelectorAll('.service-item');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active button style
      tabButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-stone-900', 'text-white', 'border-stone-900');
        btn.classList.add('bg-white', 'text-stone-700', 'border-stone-200');
      });

      button.classList.add('active', 'bg-stone-900', 'text-white', 'border-stone-900');
      button.classList.remove('bg-white', 'text-stone-700', 'border-stone-200');

      const targetCategory = button.getAttribute('data-category');

      serviceCards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || itemCategory === targetCategory) {
          card.style.display = 'flex';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 3. Booking Modal & WhatsApp Dispatch
let currentPreselectedService = '';

function openBookingModal(serviceName = '') {
  const modal = document.getElementById('booking-modal');
  const serviceSelect = document.getElementById('booking-service-select');
  
  if (serviceName && serviceSelect) {
    // If exact match doesn't exist in dropdown, append or match closest
    let matched = false;
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const newOpt = new Option(serviceName, serviceName, true, true);
      serviceSelect.add(newOpt);
    }
  }

  // Set minimum date to today
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) dateInput.value = today;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = 'auto';
}

function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('close-booking-modal');
  const cancelBtn = document.getElementById('cancel-booking-modal');
  const form = document.getElementById('booking-form');

  if (closeBtn) closeBtn.addEventListener('click', closeBookingModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeBookingModal);

  // Close when clicking backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBookingModal();
    });
  }

  // Handle Booking Form Submit via WhatsApp or Instant Confirmation
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('booking-name').value.trim();
      const phone = document.getElementById('booking-phone').value.trim();
      const service = document.getElementById('booking-service-select').value;
      const date = document.getElementById('booking-date').value;
      const time = document.getElementById('booking-time').value;
      const notes = document.getElementById('booking-notes').value.trim();

      const message = `Hello Nail n Lash Studio! ✨%0A%0AI would like to book an appointment:%0A• *Client Name:* ${encodeURIComponent(name)}%0A• *Phone:* ${encodeURIComponent(phone)}%0A• *Service:* ${encodeURIComponent(service)}%0A• *Preferred Date:* ${encodeURIComponent(date)}%0A• *Preferred Time:* ${encodeURIComponent(time)}%0A${notes ? `• *Special Notes:* ${encodeURIComponent(notes)}%0A` : ''}%0A*Location:* SCO 107, Phase 10, Sector 64, Mohali (SAS Nagar)%0A%0APlease confirm availability. Thank you!`;

      // Open WhatsApp with prefilled message
      const whatsappUrl = `https://wa.me/918427520007?text=${message}`;
      window.open(whatsappUrl, '_blank');

      showToast('Booking request prepared in WhatsApp! We look forward to pampering you.');
      closeBookingModal();
      form.reset();
    });
  }
}

// 4. Academy Syllabus Modal
function openAcademyModal(courseName = '') {
  const modal = document.getElementById('academy-modal');
  const courseInput = document.getElementById('academy-course-field');
  if (courseInput && courseName) {
    courseInput.value = courseName;
  }
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeAcademyModal() {
  const modal = document.getElementById('academy-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = 'auto';
}

function initAcademyModal() {
  const modal = document.getElementById('academy-modal');
  const closeBtn = document.getElementById('close-academy-modal');
  const form = document.getElementById('academy-form');

  if (closeBtn) closeBtn.addEventListener('click', closeAcademyModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAcademyModal();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('student-name').value.trim();
      const phone = document.getElementById('student-phone').value.trim();
      const course = document.getElementById('academy-course-field').value;
      const experience = document.getElementById('student-experience').value;

      const message = `Hello Nail n Lash Academy! 🎓%0A%0AI am interested in professional certification courses:%0A• *Applicant:* ${encodeURIComponent(name)}%0A• *Phone:* ${encodeURIComponent(phone)}%0A• *Course:* ${encodeURIComponent(course)}%0A• *Experience Level:* ${encodeURIComponent(experience)}%0A%0APlease share the upcoming batch schedule, fee structure, and syllabus. Thank you!`;

      const whatsappUrl = `https://wa.me/918427520007?text=${message}`;
      window.open(whatsappUrl, '_blank');

      showToast('Academy inquiry dispatched! Our course coordinator will connect with you.');
      closeAcademyModal();
      form.reset();
    });
  }
}

// 5. Copy Address Helper
function initCopyAddress() {
  const copyBtn = document.getElementById('btn-copy-address');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const address = "Ground Floor and Basement, SCO 107, Phase 10, Sector 64, Sahibzada Ajit Singh Nagar (Mohali), Punjab 160062";
    navigator.clipboard.writeText(address).then(() => {
      showToast('Studio address copied to clipboard!');
    }).catch(() => {
      showToast('Address: SCO 107, Phase 10, Sector 64, Mohali, Punjab 160062');
    });
  });
}

// 6. Mobile Navigation
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// 7. Toast Notification Utility
function showToast(message) {
  let toast = document.getElementById('luxury-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'luxury-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 px-5 py-3.5 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-3 text-sm transform transition-all duration-300 translate-y-12 opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-[#C5A059]"></span>
    <span>${message}</span>
  `;

  toast.classList.remove('translate-y-12', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-12', 'opacity-0');
  }, 4000);
}

// Global window exposure for inline onclick handlers
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.openAcademyModal = openAcademyModal;
window.closeAcademyModal = closeAcademyModal;
window.showToast = showToast;

