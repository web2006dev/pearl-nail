/* Pearl Nails - Application Controller & Interactive Logic */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });

    // 2. Mobile burger menu
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    if (burger && navLinks) {
      burger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        burger.setAttribute('aria-expanded', String(isOpen));
      });
      // Close menu when clicking link
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // 3. Live Opening Hours badge
    const liveStatus = document.getElementById('liveHoursStatus');
    if (liveStatus) {
      const now = new Date();
      const currentHour = now.getHours();
      // Pearl Nails open 10:00 AM to 9:00 PM (21:00)
      if (currentHour >= 10 && currentHour < 21) {
        liveStatus.innerHTML = '<span class="pulse-dot"></span> Open Now · Closes 9:00 PM';
      } else if (currentHour < 10) {
        liveStatus.innerHTML = '<span class="pulse-dot" style="background:#C5A059;"></span> Opens Today at 10:00 AM';
      } else {
        liveStatus.innerHTML = '<span class="pulse-dot" style="background:#888;"></span> Closed Now · Opens Tomorrow at 10:00 AM';
      }
    }

    // 4. Render Mood Board Looks
    const lookCardsContainer = document.getElementById('lookCards');
    const D = window.NailDesign;
    if (lookCardsContainer && D && D.looks) {
      function renderLooks(filter = 'All') {
        const filtered = filter === 'All' 
          ? D.looks 
          : D.looks.filter(l => l.mood.toLowerCase() === filter.toLowerCase() || (filter === 'Romantic' && l.mood === 'Bridal Glam'));

        lookCardsContainer.innerHTML = filtered.map(look => `
          <article class="look-card" data-mood="${look.mood}">
            <div class="look-photo">
              <img src="${look.image}" alt="${look.name} set at Pearl Nails" loading="lazy">
              <span class="look-tag">${look.mood}</span>
            </div>
            <div class="look-body">
              <h3>${look.name}</h3>
              <p>${look.desc}</p>
              <div class="look-details">
                <span class="look-pill">${look.shape}</span>
                <span class="look-pill">${look.finish}</span>
                <span class="look-pill">${look.color}</span>
              </div>
              <div class="look-cta">
                <button type="button" class="nm-text-link apply-look-btn" data-look-id="${look.id}">
                  Try on Canvas ↗
                </button>
                <a href="https://wa.me/919915522210?text=Hello%20Pearl%20Nails!%20I%20love%20the%20${encodeURIComponent(look.name)}%20set%20and%20want%20to%20book%20an%20appointment." target="_blank" rel="noopener" class="btn btn-outline" style="padding:6px 14px; font-size:10px;">
                  Book Look
                </a>
              </div>
            </div>
          </article>
        `).join('');

        // Attach listeners to "Try on Canvas" buttons
        lookCardsContainer.querySelectorAll('.apply-look-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const lookId = btn.dataset.lookId;
            const chosen = D.looks.find(l => l.id === lookId);
            if (chosen) {
              window.dispatchEvent(new CustomEvent('pearlApplyLook', { detail: chosen }));
            }
          });
        });
      }

      // Initial render
      renderLooks('All');

      // Filter buttons
      const filterGroup = document.getElementById('lookFilters');
      if (filterGroup) {
        filterGroup.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            filterGroup.querySelectorAll('button').forEach(b => {
              b.classList.remove('active');
              b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            renderLooks(btn.dataset.filter);
          });
        });
      }
    }

    // 5. Treatment Menu Category Tabs
    const menuTabs = document.querySelectorAll('.menu-tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        menuTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.cat;
        menuCards.forEach(card => {
          if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // 6. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-q');
      if (btn) {
        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          // Close others
          faqItems.forEach(i => i.classList.remove('open'));
          if (!isOpen) {
            item.classList.add('open');
          }
        });
      }
    });

    // 7. Lightbox for Lookbook Gallery
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('.gallery-overlay h4')?.textContent || 'Pearl Nails Client Set';
        if (lightbox && lightboxImg && img) {
          lightboxImg.src = img.src;
          if (lightboxCaption) lightboxCaption.textContent = title;
          lightbox.classList.add('is-active');
        }
      });
    });

    if (lightboxClose && lightbox) {
      lightboxClose.addEventListener('click', () => lightbox.classList.remove('is-active'));
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('is-active');
      });
    }

    // 8. Style Matcher Quiz Dialog
    const matchDialog = document.getElementById('matchDialog');
    const openMatchBtns = document.querySelectorAll('[data-open-match]');
    const closeMatch = document.getElementById('closeMatch');
    const matchForm = document.getElementById('matchForm');
    const matchResult = document.getElementById('matchResult');

    openMatchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (matchDialog) {
          matchDialog.classList.add('is-active');
          if (matchResult) matchResult.hidden = true;
          if (matchForm) matchForm.hidden = false;
        }
      });
    });

    if (closeMatch && matchDialog) {
      closeMatch.addEventListener('click', () => matchDialog.classList.remove('is-active'));
      matchDialog.addEventListener('click', (e) => {
        if (e.target === matchDialog) matchDialog.classList.remove('is-active');
      });
    }

    if (matchForm && matchResult) {
      matchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(matchForm);
        const mood = data.get('mood');
        const shape = data.get('shape') || 'Almond';
        const finish = data.get('finish') || 'Glossy';

        // Find or create matching look
        const match = (D && D.looks.find(l => l.mood === mood)) || D.looks[0];

        matchForm.hidden = true;
        matchResult.hidden = false;
        matchResult.innerHTML = `
          <div style="text-align:center; padding: 10px 0;">
            <p class="nm-kicker">Your Match is Ready</p>
            <h3 style="font-size: 2.2rem; margin: 10px 0 16px;">${match.name}</h3>
            <img src="${match.image}" alt="${match.name}" style="max-height:220px; border-radius:12px; margin:0 auto 16px; object-fit:cover;">
            <p style="font-size:14px; margin-bottom:20px;">${match.desc} Customized in ${shape} shape with a luxurious ${finish} finish.</p>
            <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
              <button type="button" class="btn btn-gold" id="applyMatchToCanvas">
                Customize on Canvas ↗
              </button>
              <a href="https://wa.me/919915522210?text=Hello%20Pearl%20Nails!%20My%20Style%20Match%20is%20${encodeURIComponent(match.name)}%20(${shape},%20${finish}).%20Can%20I%20book%20a%20slot?" target="_blank" rel="noopener" class="btn btn-champagne">
                Book via WhatsApp
              </a>
            </div>
          </div>
        `;

        document.getElementById('applyMatchToCanvas')?.addEventListener('click', () => {
          matchDialog.classList.remove('is-active');
          window.dispatchEvent(new CustomEvent('pearlApplyLook', { detail: match }));
        });
      });
    }

    // 9. Booking Consultation Modal
    const bookingModal = document.getElementById('bookingModal');
    const openBookingBtns = document.querySelectorAll('[data-open-booking]');
    const closeBooking = document.getElementById('closeBooking');
    const appointmentForm = document.getElementById('appointmentForm');

    openBookingBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = btn.dataset.service || '';
        const serviceSelect = document.getElementById('bookServiceSelect');
        if (serviceSelect && serviceName) {
          serviceSelect.value = serviceName;
        }
        bookingModal?.classList.add('is-active');
      });
    });

    if (closeBooking && bookingModal) {
      closeBooking.addEventListener('click', () => bookingModal.classList.remove('is-active'));
      bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) bookingModal.classList.remove('is-active');
      });
    }

    if (appointmentForm) {
      appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('bookName')?.value || 'Guest';
        const phone = document.getElementById('bookPhone')?.value || '';
        const service = document.getElementById('bookServiceSelect')?.value || 'Nail Extensions';
        const date = document.getElementById('bookDate')?.value || 'Earliest available';
        const time = document.getElementById('bookTime')?.value || 'Preferred slot';
        const notes = document.getElementById('bookNotes')?.value || 'None';

        const msg = encodeURIComponent(
          `✨ *New Appointment Request - Pearl Nails*\n\n` +
          `👤 *Name:* ${name}\n` +
          `📞 *Phone:* ${phone}\n` +
          `💅 *Service:* ${service}\n` +
          `📅 *Date:* ${date}\n` +
          `⏰ *Time Slot:* ${time}\n` +
          `📝 *Notes:* ${notes}\n\n` +
          `_Studio: SCF -62, 1st Floor, 3B2 Market, Mohali_`
        );

        window.open(`https://wa.me/919915522210?text=${msg}`, '_blank');
        bookingModal?.classList.remove('is-active');
      });
    }

    // 10. Background Video Sync & Toggle
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
      heroVideo.muted = true;
      heroVideo.play().catch(() => {
        // Fallback gracefully to poster image
      });
    }
  });
})();
