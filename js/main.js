/*
 * Dr. Mukhtar's Imaging Centre - Core Interaction Script
 * Handlers for Mobile Navigation, Sticky Header Scroll, FAQs Accordion, Subpage Tab Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. PET-CT Promo Modal Ad Trigger (1.2 seconds delay)
  const promoModal = document.getElementById('promoModal');
  const promoClose = document.querySelector('.promo-modal-close');
  const promoBookBtn = document.getElementById('promoBookBtn');

  if (promoModal) {
    // Only show the modal if the user hasn't seen it in this session
    if (!sessionStorage.getItem('promoModalSeen')) {
      // Show after a longer delay (4 seconds) to prevent it from ruining Google Lighthouse LCP scores
      setTimeout(() => {
        promoModal.style.display = 'flex';
        // Force repaint to trigger animation
        promoModal.offsetHeight;
        promoModal.classList.add('show');
        sessionStorage.setItem('promoModalSeen', 'true');
      }, 4000);
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
    const topbar  = document.querySelector('.top-bar');
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
      const lowerParam = serviceParam.toLowerCase();
      const serviceMap = {
        'pet-ct': 'Digital PET-CT Scan',
        'pet': 'Digital PET-CT Scan',
        'mri': 'High-Field MRI',
        'ct': 'Multi-Slice CT Scan',
        'ultrasound': 'Ultrasound / Doppler',
        'doppler': 'Ultrasound / Doppler',
        'usg': 'Ultrasound / Doppler',
        'abdominal-usg': 'Basic Abdominal & Obstetric USG',
        'obstetric-usg': 'Basic Abdominal & Obstetric USG',
        'small-part': 'Small Part USG (Thyroid/Breast/Scrotum)',
        'small-parts': 'Small Part USG (Thyroid/Breast/Scrotum)',
        'msk': 'Musculoskeletal / Nerve USG',
        'musculoskeletal': 'Musculoskeletal / Nerve USG',
        'tvs': 'Transvaginal USG (TVS)',
        'transvaginal': 'Transvaginal USG (TVS)',
        'vascular': 'Vascular Color Doppler Studies',
        'doppler-studies': 'Vascular Color Doppler Studies',
        'x-ray': 'Digital X-Ray',
        'xray': 'Digital X-Ray',
        'mammography': 'Mammography',
        'mammogram': 'Mammography',
        'dexa': 'Bone DEXA / Spirometry',
        'densitometry': 'Bone DEXA / Spirometry',
        'spirometry': 'Bone DEXA / Spirometry'
      };

      let matchedValue = null;
      for (const [key, value] of Object.entries(serviceMap)) {
        if (lowerParam.includes(key)) {
          matchedValue = value;
          break;
        }
      }

      if (matchedValue) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === matchedValue) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      } else {
        // Fallback to direct substring matching
        for (let i = 0; i < serviceSelect.options.length; i++) {
          const optionVal = serviceSelect.options[i].value.toLowerCase();
          if (optionVal.includes(lowerParam) || lowerParam.includes(optionVal)) {
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

  // 7. Interactive Lightbox Gallery
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  
  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => {
      return {
        src: item.getAttribute('data-src') || item.querySelector('img').getAttribute('src'),
        caption: item.getAttribute('data-caption') || item.querySelector('.gallery-overlay span').textContent
      };
    });

    const showImage = (index) => {
      currentIndex = index;
      const imgData = images[currentIndex];
      lightboxImg.setAttribute('src', imgData.src);
      lightboxCaption.textContent = imgData.caption;
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        showImage(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable background scroll
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scroll
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let index = currentIndex - 1;
        if (index < 0) index = images.length - 1;
        showImage(index);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let index = currentIndex + 1;
        if (index >= images.length) index = 0;
        showImage(index);
      });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  }

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

  // 10. Reports Request Modal Handler
  const reportsModal = document.getElementById('reportsModal');
  const reportsForm = document.getElementById('reportsForm');
  const reportsClose = document.querySelector('.reports-modal-close');
  const triggerReportsBtns = document.querySelectorAll('.report-btn, .nav-get-reports-btn');

  if (reportsModal) {
    const openReportsModal = (e) => {
      e.preventDefault();
      reportsModal.style.display = 'flex';
      reportsModal.style.opacity = '1';
      reportsModal.classList.add('show');
    };

    const closeReportsModal = () => {
      reportsModal.classList.remove('show');
      reportsModal.style.opacity = '0';
      setTimeout(() => {
        reportsModal.style.display = 'none';
      }, 400);
    };

    triggerReportsBtns.forEach(btn => {
      btn.addEventListener('click', openReportsModal);
    });

    if (reportsClose) reportsClose.addEventListener('click', closeReportsModal);

    reportsModal.addEventListener('click', (e) => {
      if (e.target === reportsModal) {
        closeReportsModal();
      }
    });

    if (reportsForm) {
      reportsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reportName').value.trim();
        const phone = document.getElementById('reportPhone').value.trim();
        const type = document.getElementById('reportType').value;
        const date = document.getElementById('reportDate').value;

        if (!name || !phone || !type || !date) {
          alert('Please fill out all required fields.');
          return;
        }

        const whatsappText = `Hello Dr. Mukhtar's Imaging Centre, I would like to request my diagnostic reports.
*Patient Name:* ${name}
*Phone Number:* ${phone}
*Scan / Test Type:* ${type}
*Date of Scan:* ${date}`;

        const encodedText = encodeURIComponent(whatsappText);
        const whatsappUrl = `https://wa.me/917889907742?text=${encodedText}`;
        
        alert('Thank you! Redirecting you to submit your report request on WhatsApp.');
        window.open(whatsappUrl, '_blank');
        closeReportsModal();
        reportsForm.reset();
      });
    }
  }

});
