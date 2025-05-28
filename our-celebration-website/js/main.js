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

})();