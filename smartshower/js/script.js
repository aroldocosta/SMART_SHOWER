document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            const delay = el.getAttribute('data-delay') || 0;

            if (elementTop < windowHeight - elementVisible) {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // Header shift on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Form submission (demo)
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Sucesso! Entraremos em contato.';
                btn.style.background = '#27ae60';
                form.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Mobile Menu Toggle (Simplified)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            alert('Menu mobile ativado! (Implementação de overlay necessária para navegação completa)');
        });
    }
});

function sendToWhatsApp() {
    const name = document.getElementById('name').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const barraca = document.getElementById('barraca').value.trim();

    if (!name || !whatsapp || !barraca) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const message = `Olá, meu nome é ${name} e eu gostaria de conhecer o SmartShower. Meu WhatsApp é ${whatsapp} e o nome da minha barraca é ${barraca}.`;

    const url = `https://wa.me/5585991351205?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
}
