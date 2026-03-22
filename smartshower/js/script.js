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
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ROI Calculator
    const banhistasInput = document.getElementById('banhistas-dia');
    const valorInput = document.getElementById('valor-banho');
    const revenueDisplay = document.getElementById('total-revenue');
    const profitDisplay = document.getElementById('total-profit');

    const calculateROI = () => {
        const banhistas = parseInt(banhistasInput.value) || 0;
        const valor = parseFloat(valorInput.value) || 0;

        const monthlyRevenue = banhistas * valor * 30;
        // Estimativa simplificada: 70% de lucro (considerando repasse e custos fixos)
        const monthlyProfit = monthlyRevenue * 0.7;

        revenueDisplay.innerText = monthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        profitDisplay.innerText = monthlyProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (banhistasInput && valorInput) {
        banhistasInput.addEventListener('input', calculateROI);
        valorInput.addEventListener('input', calculateROI);
        calculateROI(); // Initial calc
    }
});

function sendToWhatsApp() {
    const name = document.getElementById('name').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const barraca = document.getElementById('barraca') ? document.getElementById('barraca').value.trim() : '';

    if (!name || !whatsapp) {
        alert("Por favor, preencha os campos obrigatórios.");
        return;
    }

    const message = `Olá! Sou o(a) ${name} da barraca ${barraca}. Vi o Programa de Parceiros Fundadores do SmartShower e gostaria de mais informações. Meu WhatsApp é ${whatsapp}.`;

    const url = `https://wa.me/5585991351205?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
}
