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

            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ROI Calculator Section
    const banhistasInput = document.getElementById('banhistas-dia');
    const valorInput = document.getElementById('valor-banho');
    const metroCubicoInput = document.getElementById('valor-metro-cubico');
    const revenueDisplay = document.getElementById('total-revenue');
    const dailyProfitDisplay = document.getElementById('daily-profit');
    const profitDisplay = document.getElementById('total-profit');

    function calculateROI() {
        if (!banhistasInput || !valorInput || !metroCubicoInput) return;

        const banhistas = parseInt(banhistasInput.value) || 0;
        const valorSugerido = parseFloat(valorInput.value) || 0;
        const valorMetroCubico = parseFloat(metroCubicoInput.value) || 0;

        // Custo da Água (12L por m³ / 1000)
        const custoAgua = (12 * valorMetroCubico) / 1000;

        // Lucro por minuto (Preço Sugerido - Custo da Água) - 25% PaguePix - 1% Taxa
        const lucroPorMinuto = (valorSugerido - custoAgua) - (valorSugerido * 0.25) - (valorSugerido * 0.01);

        // Resultados
        const dailyProfit = banhistas * lucroPorMinuto;
        const monthlyProfit = 30 * dailyProfit;
        const monthlyRevenue = banhistas * valorSugerido * 30;

        // Update UI
        if (revenueDisplay) revenueDisplay.innerText = monthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (dailyProfitDisplay) dailyProfitDisplay.innerText = dailyProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (profitDisplay) profitDisplay.innerText = monthlyProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Custom UI buttons for +/-
    document.querySelectorAll('.ctrl-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;

            const step = parseFloat(input.getAttribute('step')) || 1;
            const min = parseFloat(input.getAttribute('min')) || 0;
            let val = parseFloat(input.value) || 0;

            if (btn.classList.contains('plus')) {
                val += step;
            } else {
                val = Math.max(min, val - step);
            }

            // Formatting: integer for banhistas, float for values
            input.value = (step < 1) ? val.toFixed(2) : val.toFixed(0);

            // Trigger calculation
            calculateROI();
        });
    });

    // Direct input change handling
    [banhistasInput, valorInput, metroCubicoInput].forEach(input => {
        if (input) {
            input.addEventListener('input', calculateROI);
        }
    });

    // Initial run
    calculateROI();
});

// Helper for WhatsApp
function sendToWhatsApp() {
    const name = document.getElementById('name').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const barracaInput = document.getElementById('barraca');
    const barraca = barracaInput ? barracaInput.value.trim() : '';

    if (!name || !whatsapp) {
        alert("Por favor, preencha os campos obrigatórios.");
        return;
    }

    const message = `Olá! Sou o(a) ${name} da barraca ${barraca}. Vi o Programa de Parceiros Fundadores do SmartShower e gostaria de mais informações. Meu WhatsApp é ${whatsapp}.`;
    const url = `https://wa.me/5585991351205?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
