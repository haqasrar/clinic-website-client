/*
 * Dr. Mukhtars Imaging Centre - Core Interaction Script
 * Handlers for Mobile Navigation, Sticky Header Scroll, FAQs Accordion, Subpage Tab Switcher
 */

// Reports modal handlers at document level — survive any DOMContentLoaded errors

function _openReportsModal() {
  var m = document.getElementById('reportsModal');
  if (m) { m.style.display = 'flex'; m.style.opacity = '1'; m.classList.add('show'); }
}

function _closeReportsModal() {
  var m = document.getElementById('reportsModal');
  if (m) { m.classList.remove('show'); m.style.opacity = '0'; setTimeout(function(){ m.style.display = 'none'; }, 400); }
}

document.addEventListener('click', function(e) {
  // Open modal from trigger buttons
  var btn = e.target.closest('.report-btn, .nav-get-reports-btn');
  if (btn) { e.preventDefault(); _openReportsModal(); return; }

  // Close button
  if (e.target.closest('.reports-modal-close')) { _closeReportsModal(); return; }

  // Click on modal backdrop
  if (e.target === document.getElementById('reportsModal')) { _closeReportsModal(); }

  // WhatsApp floating menu links
  var petct = e.target.closest('.whatsapp-petct');
  if (petct) { e.preventDefault(); window.open('https://wa.me/919906931316?text=' + encodeURIComponent('Hello Dr. Mukhtars Imaging Centre, I would like to know more about PET-CT. Please share the available appointment slots and guide me through the booking process. Thank you'), '_blank'); return; }

  var svc = e.target.closest('.whatsapp-services');
  if (svc) { e.preventDefault(); window.open('https://wa.me/917889907742?text=' + encodeURIComponent('Hello Dr. Mukhtars Imaging Centre, I would like to get more details about services. Please share the available appointment slots and guide me through the booking process. Thank you'), '_blank'); }

  // Call Now dropdown toggle
  var trigger = e.target.closest('.call-menu-trigger');
  if (trigger) {
    e.preventDefault();
    var wrapper = trigger.closest('.call-menu-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('active');
    }
    return;
  }

  // Close dropdown when clicking outside
  if (!e.target.closest('.call-menu-wrapper')) {
    document.querySelectorAll('.call-menu-wrapper.active').forEach(function(w) { w.classList.remove('active'); });
  }
});

document.addEventListener('submit', function(e) {
  if (e.target.id === 'reportsForm') {
    e.preventDefault();
    var pid  = document.getElementById('reportPatientId').value.trim();
    var name = document.getElementById('reportName').value.trim();
    var ph   = document.getElementById('reportPhone').value.trim();
    var type = document.getElementById('reportType').value;
    var date = document.getElementById('reportDate').value;
    if (!pid || !name || !ph || !type || !date) { alert('Please fill out all required fields.'); return; }
    var text = 'Hello Dr. Mukhtars Imaging Centre, I would like to request my diagnostic reports.\n*Patient ID:* ' + pid + '\n*Patient Name:* ' + name + '\n*Phone Number:* ' + ph + '\n*Scan / Test Type:* ' + type + '\n*Date of Scan:* ' + date;
    alert('Thank you! Redirecting you to submit your report request on WhatsApp.');
    window.open('https://wa.me/917889907742?text=' + encodeURIComponent(text), '_blank');
    _closeReportsModal();
    e.target.reset();
  }
});

// Lightbox gallery state
var _lbIndex = 0;
var _lbImages = null;
function _lbBuild() {
  if (_lbImages) return;
  var items = document.querySelectorAll('.gallery-item');
  if (!items.length) { _lbImages = []; return; }
  _lbImages = Array.from(items).map(function(item) {
    return {
      src: item.getAttribute('data-src') || item.querySelector('img').getAttribute('src'),
      caption: item.getAttribute('data-caption') || ''
    };
  });
}
function _lbShow(idx) {
  _lbBuild();
  if (!_lbImages || !_lbImages.length) return;
  _lbIndex = idx;
  var img = document.getElementById('lightbox-img');
  var cap = document.getElementById('lightbox-caption');
  var lb  = document.getElementById('lightbox');
  if (!img || !lb) return;
  img.setAttribute('src', _lbImages[idx].src);
  if (cap) cap.textContent = _lbImages[idx].caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function _lbClose() {
  var lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = 'auto';
}
function _lbPrev() {
  if (!_lbImages || !_lbImages.length) return;
  var i = _lbIndex - 1;
  if (i < 0) i = _lbImages.length - 1;
  _lbShow(i);
}
function _lbNext() {
  if (!_lbImages || !_lbImages.length) return;
  var i = _lbIndex + 1;
  if (i >= _lbImages.length) i = 0;
  _lbShow(i);
}

document.addEventListener('click', function(e) {
  var item = e.target.closest('.gallery-item');
  if (item) {
    var idx = Array.from(document.querySelectorAll('.gallery-item')).indexOf(item);
    if (idx > -1) _lbShow(idx);
    return;
  }
  if (e.target.closest('.lightbox-close')) { _lbClose(); return; }
  if (e.target === document.getElementById('lightbox')) { _lbClose(); return; }
  if (e.target.closest('#lightbox-prev')) { e.stopPropagation(); _lbPrev(); return; }
  if (e.target.closest('#lightbox-next')) { e.stopPropagation(); _lbNext(); return; }
});

document.addEventListener('keydown', function(e) {
  var lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('active')) return;
  if (e.key === 'Escape') _lbClose();
  if (e.key === 'ArrowLeft') _lbPrev();
  if (e.key === 'ArrowRight') _lbNext();
});

document.addEventListener('DOMContentLoaded', () => {
  // 0. PET-CT Promo Modal Ad Trigger (1.2 seconds delay)
  const promoModal = document.getElementById('promoModal');
  const promoClose = document.querySelector('.promo-modal-close');
  const promoBookBtn = document.getElementById('promoBookBtn');

  if (promoModal) {
    // Only show the modal if the user hasn't seen it in this session
    if (!sessionStorage.getItem('promoModalSeen')) {
      const showModalOnScroll = () => {
        // Trigger when user scrolls down a little bit
        if (window.scrollY > 150) {
          promoModal.style.display = 'flex';
          promoModal.offsetHeight; // Force repaint
          promoModal.classList.add('show');
          sessionStorage.setItem('promoModalSeen', 'true');
          window.removeEventListener('scroll', showModalOnScroll);
        }
      };
      
      // Delay adding the scroll listener slightly so it doesn't trigger on page refresh if already scrolled
      setTimeout(() => {
        window.addEventListener('scroll', showModalOnScroll, { passive: true });
      }, 1000);
    }

    const closePromo = () => {
      promoModal.classList.remove('show');
      setTimeout(() => {
        promoModal.style.display = 'none';
      }, 400); // match transition duration
    };

    if (promoClose) promoClose.addEventListener('click', closePromo);

    promoModal.addEventListener('click', (e) => {
      if (e.target === promoModal) {
        closePromo();
      }
    });

    if (promoBookBtn) {
      promoBookBtn.addEventListener('click', (e) => {
        closePromo();
        // Allow smooth scroll to take place
        const target = document.querySelector('#appointment');
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // 1. Sticky Header Scroll Effect + Hero Parallax
  const header = document.querySelector('.header-wrapper');
  const heroBg = document.getElementById('heroBg');

  if (header || heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      // Sticky header
      if (header) {
        if (scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Parallax on hero background
      if (heroBg) {
        const parallaxOffset = scrollY * 0.35;
        heroBg.style.transform = `scale(1.12) translateY(${parallaxOffset}px)`;
      }
    }, { passive: true });
  }

  // ECG: zoom-proof positioning — always below real header, content always below ECG
  const ecgWrap = document.querySelector('.hero-ecg-wrap');
  const heroContent = document.querySelector('.hero-cin-content');

  function positionECG() {
    const topbar  = document.querySelector('.topbar');
    const navbar  = document.querySelector('.header-wrapper');
    const topbarH = topbar ? topbar.offsetHeight : 0;
    const navbarH = navbar ? navbar.offsetHeight : 0;
    const totalH  = topbarH + navbarH;

    // Place ECG right below the header
    if (ecgWrap) {
      ecgWrap.style.top = totalH + 'px';
    }

    // Push hero text content below header + ECG strip (80px) + 16px breathing room
    if (heroContent) {
      heroContent.style.paddingTop = (totalH + 96) + 'px';
    }
  }

  positionECG();
  window.addEventListener('resize', positionECG);



  // 2. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      document.body.classList.toggle('mobile-menu-active');
      
      // Animate hamburger lines
      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking navigation links
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.classList.remove('mobile-menu-active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // 2b. Mobile Info Drawer Toggle
  const infoToggle = document.querySelector('.info-toggle');
  const infoDrawer = document.getElementById('mobileInfoDrawer');
  const infoOverlay = document.getElementById('mobileInfoOverlay');
  const infoClose = document.getElementById('mobileInfoClose');

  const openInfoDrawer = () => {
    if (infoDrawer) infoDrawer.classList.add('active');
    if (infoOverlay) infoOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeInfoDrawer = () => {
    if (infoDrawer) infoDrawer.classList.remove('active');
    if (infoOverlay) infoOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (infoToggle) infoToggle.addEventListener('click', openInfoDrawer);
  if (infoClose) infoClose.addEventListener('click', closeInfoDrawer);
  if (infoOverlay) infoOverlay.addEventListener('click', closeInfoDrawer);

  // Close info drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInfoDrawer();
  });



  // 3. FAQ Accordion Toggle
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(faqHeader => {
    faqHeader.addEventListener('click', () => {
      const faqItem = faqHeader.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close all open FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // If clicked item wasn't active, open it
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // 4. Multi-tab Switcher (Services Details & Patient Preparations)
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      // If there's no data-tab (e.g. on lab-tests page), ignore this global handler
      if (!tabId) return;
      
      const container = btn.closest('.tabs-container');
      
      if (container) {
        // Remove active class from buttons in this tab group
        container.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
        });
        
        // Remove active class from tab panes in this tab group
        container.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        
        // Add active classes
        btn.classList.add('active');
        const targetPane = container.querySelector(`#${tabId}`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      }
    });
  });

  // Activate tab from URL hash on page load
  const activateTabFromHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const targetBtn = document.querySelector(`.tab-btn[data-tab="${hash.replace('#', '')}"]`);
      if (targetBtn) {
        targetBtn.click();
        setTimeout(() => {
          targetBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };
  activateTabFromHash();
  window.addEventListener('hashchange', activateTabFromHash);

  // 5. Dynamic Analog vs Digital PET-CT Selector (Highlighting benefits)
  const compRows = document.querySelectorAll('.comparison-table tbody tr');
  compRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.transform = 'scale(1.01)';
      row.style.transition = 'transform 0.2s ease, background 0.2s ease';
      row.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
    });
    row.addEventListener('mouseleave', () => {
      row.style.transform = 'none';
      row.style.boxShadow = 'none';
    });
  });

  // 6. Appointment Form Validation and Submission Handler
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple client-side check
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const service = document.getElementById('formService').value;
      const date = document.getElementById('formDate').value;
      const referral = document.getElementById('formReferral') ? document.getElementById('formReferral').value : '';
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !phone || !service || !date) {
        alert('Please fill out all required fields.');
        return;
      }

      const sheetUrl = appointmentForm.dataset.sheetUrl || '';

      if (!sheetUrl || sheetUrl.includes('YOUR_SCRIPT_ID')) {
        alert('The form is not connected yet. Please add your Google Apps Script Web App URL to the contact form.');
        return;
      }

      const formData = new FormData(appointmentForm);
      formData.set('submittedAt', new Date().toISOString());

      const successMessage = appointmentForm.querySelector('.form-success-message');
      const submitButton = appointmentForm.querySelector('[type="submit"]');
      if (successMessage) {
        successMessage.innerHTML = '';
      }
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        if (!submitButton.dataset.originalText) {
          submitButton.dataset.originalText = submitButton.innerHTML;
        }
        submitButton.innerHTML = '<span class="btn-spinner"></span> Sending...';
      }

      fetch(sheetUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      })
        .then(() => {
          if (successMessage) {
            successMessage.innerHTML = '<div class="success-card"><span class="success-icon">\u2714</span><div><strong>Request received!</strong><p>We will connect with you shortly.</p></div></div>';
            successMessage.classList.add('show');
          }
          appointmentForm.reset();
        })
        .catch(() => {
          if (successMessage) {
            successMessage.innerHTML = '<div class="error-card"><strong>Submission failed.</strong><p>Please try again or contact us directly.</p></div>';
            successMessage.classList.add('show');
          }
        })
        .finally(() => {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '';
            submitButton.innerHTML = submitButton.dataset.originalText || submitButton.innerHTML;
          }
        });
    });
  }

  // 6.5. URL Query Parameter Pre-filling (for redirected service bookings)
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const testParam = urlParams.get('test');

  if (serviceParam) {
    const serviceSelect = document.getElementById('formService');
    if (serviceSelect) {
      const lowerParam = serviceParam.toLowerCase().trim();
      const normalize = (text) => text.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9\-\/ ]/g, '').trim();
      const normalizedParam = normalize(lowerParam);
      const serviceMap = {
        'digital pet ct scan': 'Digital PET-CT Scan',
        'digital pet-ct scan': 'Digital PET-CT Scan',
        'pet-ct': 'Digital PET-CT Scan',
        'pet': 'Digital PET-CT Scan',
        'high-field mri': 'High-Field MRI',
        'mri': 'High-Field MRI',
        'multi-slice ct scan': 'Multi-Slice CT Scan',
        'ct': 'Multi-Slice CT Scan',
        'ultrasound / doppler': 'Ultrasound / Doppler',
        'ultrasound': 'Ultrasound / Doppler',
        'doppler': 'Ultrasound / Doppler',
        'usg': 'Ultrasound / Doppler',
        'basic abdominal & obstetric usg': 'Basic Abdominal & Obstetric USG',
        'abdominal usg': 'Basic Abdominal & Obstetric USG',
        'obstetric usg': 'Basic Abdominal & Obstetric USG',
        'small part usg (thyroid/breast/scrotum)': 'Small Part USG (Thyroid/Breast/Scrotum)',
        'small part usg': 'Small Part USG (Thyroid/Breast/Scrotum)',
        'musculoskeletal / nerve usg': 'Musculoskeletal / Nerve USG',
        'musculoskeletal': 'Musculoskeletal / Nerve USG',
        'tvs': 'Transvaginal USG (TVS)',
        'transvaginal': 'Transvaginal USG (TVS)',
        'vascular color doppler studies': 'Vascular Color Doppler Studies',
        'x-ray': 'Digital X-Ray',
        'xray': 'Digital X-Ray',
        'digital x-ray': 'Digital X-Ray',
        'mammography': 'Mammography',
        'mammogram': 'Mammography',
        'dexa': 'Bone DEXA',
        'densitometry': 'Bone DEXA',
      };

      let matchedValue = null;
      if (serviceMap[normalizedParam]) {
        matchedValue = serviceMap[normalizedParam];
      } else {
        for (const [key, value] of Object.entries(serviceMap)) {
          if (normalizedParam.includes(key)) {
            matchedValue = value;
            break;
          }
        }
      }

      if (matchedValue) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.toLowerCase() === matchedValue.toLowerCase()) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      } else {
        // Fallback to direct substring matching
        for (let i = 0; i < serviceSelect.options.length; i++) {
          const optionVal = normalize(serviceSelect.options[i].value);
          if (optionVal === normalizedParam || optionVal.includes(normalizedParam) || normalizedParam.includes(optionVal)) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  }

  if (testParam) {
    const messageTextarea = document.getElementById('formMessage');
    if (messageTextarea) {
      messageTextarea.value = `I am interested in scheduling a clinical laboratory test: ${testParam}. Please coordinate preparation guidelines and scheduling.`;
    }
  }

  // 7. Interactive Lightbox Gallery — moved to document-level handler

  // 8. Homepage Service Card "Book Now" scroll & pre-select selector
  const cardBookBtns = document.querySelectorAll('.btn-card-book');
  cardBookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetService = btn.getAttribute('data-service');
      const serviceSelect = document.getElementById('formService');
      if (serviceSelect && targetService) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          const optionVal = serviceSelect.options[i].value.toLowerCase();
          const targetVal = targetService.toLowerCase();
          if (optionVal.includes(targetVal) || targetVal.includes(optionVal)) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

});
