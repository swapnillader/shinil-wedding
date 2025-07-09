// js/main.js

(function() {
    "use strict";

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim();
        if (all) {
            return [...document.querySelectorAll(el)];
        } else {
            return document.querySelector(el);
        }
    };

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all);
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener));
            } else {
                selectEl.addEventListener(type, listener);
            }
        }
    };

    /**
     * Preloader
     */
    const preloader = select('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 500);
            setTimeout(() => {
                 preloader.remove();
            }, 1000);
        });
    }

    /**
     * Navbar effects on scroll & Body Padding Adjustment
     */
    const navbar = select('#mainNav');
    const body = select('body');

    if (navbar && body) {
        const setBodyPadding = () => {
            // For desktop, use initial height. For mobile, CSS handles padding via media query.
            if (window.innerWidth >= 992) { // Corresponds to Bootstrap's 'lg' breakpoint
                 body.style.paddingTop = navbar.offsetHeight + 'px';
            } else {
                 body.style.paddingTop = select(':root').getPropertyValue('--navbar-height-scrolled').trim(); // Use scrolled height for mobile
            }
        };

        const navbarScrolled = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        };

        window.addEventListener('load', () => {
            setBodyPadding();
            navbarScrolled(); // Set initial scrolled state if page is already scrolled
        });
        window.addEventListener('resize', setBodyPadding); // Adjust padding on resize
        document.addEventListener('scroll', navbarScrolled);

        // Smooth scroll for links and close mobile nav
        on('click', '.nav-link, .scroll-down-indicator a, .back-to-top a', function(e) {
            const hash = this.hash;
            if (hash && select(hash)) { // Check if element exists
                e.preventDefault();
                let targetElement = select(hash);
                let header = select('#mainNav');
                let offset = header.offsetHeight;

                // If navbar is not scrolled and it's not mobile view, use initial height for offset
                if (!header.classList.contains('navbar-scrolled') && window.innerWidth >= 992) {
                    offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height-initial'));
                }

                let elementPosition = targetElement.offsetTop;
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });

                const toggler = select('.navbar-toggler');
                const collapse = select('.navbar-collapse');
                if (toggler && collapse.classList.contains('show')) {
                    new bootstrap.Collapse(collapse).hide();
                }
            }
        }, true);
    }


    /**
     * Back to top button
     */
    const backtotop = select('.back-to-top');
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active');
            } else {
                backtotop.classList.remove('active');
            }
        };
        window.addEventListener('load', toggleBacktotop);
        document.addEventListener('scroll', toggleBacktotop);
    }

    /**
     * Initialize AOS
     */
    window.addEventListener('load', () => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    });

    /**
     * RSVP Form: Show/hide guest details based on attendance
     */
    const attendingYesRadio = select('#attendingYes');
    const attendingNoRadio = select('#attendingNo');
    const guestDetailsDiv = select('#guestDetails');

    function toggleGuestDetails() {
        if (attendingYesRadio && attendingNoRadio && guestDetailsDiv) {
            if (attendingYesRadio.checked) {
                guestDetailsDiv.style.display = 'flex';
                const guestsSelect = select('#guests');
                if (guestsSelect) guestsSelect.setAttribute('required', 'required');
            } else {
                guestDetailsDiv.style.display = 'none';
                const guestsSelect = select('#guests');
                if (guestsSelect) guestsSelect.removeAttribute('required');
            }
        }
    }

    if (attendingYesRadio && attendingNoRadio) {
        on('change', '#attendingYes', toggleGuestDetails);
        on('change', '#attendingNo', toggleGuestDetails);
        window.addEventListener('load', toggleGuestDetails); // Initial check
    }

    /**
     * RSVP Form Submission Handling with Google Sheets
     */
    const rsvpForm = select('#rsvpForm');
    const formStatus = select('#formStatus');
    const submitBtn = select('#submitBtn');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Change button state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            }
            
            // Get form data
            const formData = new FormData(rsvpForm);
            
            // Convert FormData to URL params (this is more reliable for Google Apps Script)
            const params = new URLSearchParams();
            for (const pair of formData) {
                params.append(pair[0], pair[1]);
            }
            
            // Add timestamp
            params.append('timestamp', new Date().toISOString());
            
            // Google Apps Script Web App URL - REPLACE WITH YOUR SCRIPT URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxYUmM8jDFn7YeaCbcsYhAT-zv5ZxDtjLfBhaQq75Gg8DaBlsR5CWiv6naZFZzzwNGN/exec';
            
            // Submit form to Google Sheets using a hidden iframe (to avoid CORS issues)
            // This is a common workaround for Google Apps Script web apps
            const submitToGoogleSheets = () => {
                // Show success message and handle form reset
                const handleSuccess = () => {
                    // Success message
                    if (formStatus) {
                        formStatus.classList.remove('d-none', 'alert-danger');
                        formStatus.classList.add('alert-success');
                        formStatus.innerHTML = 'Thank you for your RSVP! We\'ve received your response and look forward to celebrating with you.';
                    }
                    
                    // Reset form
                    rsvpForm.reset();
                    
                    // Reset attendance display
                    toggleGuestDetails();
                    
                    // Scroll to message
                    if (formStatus) {
                        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    // Optional: Redirect to success page after a delay
                    setTimeout(() => {
                        window.location.href = 'success.html';
                    }, 3000);
                    
                    // Reset button state
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Send RSVP';
                    }
                };
                
                // Create a temporary form and submit it
                const tempForm = document.createElement('form');
                tempForm.setAttribute('method', 'POST');
                tempForm.setAttribute('action', scriptURL);
                tempForm.setAttribute('target', 'hidden-iframe');
                
                // Add all params to the form
                params.forEach((value, key) => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'hidden');
                    input.setAttribute('name', key);
                    input.setAttribute('value', value);
                    tempForm.appendChild(input);
                });
                
                // Create hidden iframe
                const iframe = document.createElement('iframe');
                iframe.setAttribute('name', 'hidden-iframe');
                iframe.setAttribute('style', 'display:none');
                document.body.appendChild(iframe);
                document.body.appendChild(tempForm);
                
                // Add event listeners for iframe
                iframe.addEventListener('load', handleSuccess);
                iframe.addEventListener('error', () => {
                    // Error message
                    if (formStatus) {
                        formStatus.classList.remove('d-none', 'alert-success');
                        formStatus.classList.add('alert-danger');
                        formStatus.innerHTML = 'Oops! There was a problem submitting your RSVP. Please try again or contact us directly.';
                    }
                    
                    // Reset button state
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Send RSVP';
                    }
                });
                
                // Submit the form
                tempForm.submit();
                
                // Clean up after submission
                setTimeout(() => {
                    document.body.removeChild(tempForm);
                    document.body.removeChild(iframe);
                }, 5000);
            };
            
            // Submit the form
            submitToGoogleSheets();
        });
    }

})();