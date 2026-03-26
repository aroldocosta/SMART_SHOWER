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
    const categoriaSelect = document.getElementById('categoria-tarifa');
    const faixaCheckbox = document.getElementById('faixa-consumo');
    const manualGroup = document.getElementById('manual-cost-group');
    const faixaGroup = document.getElementById('faixa-consumo-group');

    const revenueDisplay = document.getElementById('total-revenue');
    const profitDisplay = document.getElementById('total-profit');
    const marginDisplay = document.getElementById('margin-percent');

    const TARIFFS = {
        'comercial-2': {
            'base': 35.75, // 0-50m3
            'extra': 56.55  // >50m3
        },
        'comercial-popular': {
            'base': 30.22, // 21-50m3
            'extra': 53.86  // >50m3
        }
    };

    // BRL Formatting Helpers
    const parseFormattedValue = (val) => {
        if (typeof val !== 'string') val = val.toString();
        return parseFloat(val.replace(',', '.')) || 0;
    };

    const formatBRLValue = (val, decimals = 2) => {
        return val.toFixed(decimals).replace('.', ',');
    };

    function updateWaterCost() {
        if (!categoriaSelect || !faixaCheckbox || !metroCubicoInput) return;

        const categoria = categoriaSelect.value;
        const isExtra = faixaCheckbox.checked;

        if (categoria === 'manual') {
            if (manualGroup) manualGroup.style.display = 'block';
            if (faixaGroup) faixaGroup.style.display = 'none';
        } else {
            if (manualGroup) manualGroup.style.display = 'none';
            if (faixaGroup) faixaGroup.style.display = 'block';
            const cost = isExtra ? TARIFFS[categoria].extra : TARIFFS[categoria].base;
            metroCubicoInput.value = cost.toFixed(2).replace('.', ',');
        }
        calculateROI();
    }

    if (categoriaSelect) categoriaSelect.addEventListener('change', updateWaterCost);
    if (faixaCheckbox) faixaCheckbox.addEventListener('change', updateWaterCost);

    function calculateROI() {
        if (!banhistasInput || !valorInput || !metroCubicoInput) return;

        const banhistas = parseInt(banhistasInput.value) || 0;
        const valorSugerido = parseFormattedValue(valorInput.value);
        const valorMetroCubico = parseFormattedValue(metroCubicoInput.value);

        // Custo da Água (12L por m³ / 1000)
        const custoAgua = (12 * valorMetroCubico) / 1000;

        // Lucro por minuto (Preço Sugerido - Custo da Água) - 30% Retenção (SaaS + Gateway)
        const lucroPorMinuto = (valorSugerido - custoAgua) - (valorSugerido * 0.30);

        // Resultados
        const dailyProfit = banhistas * lucroPorMinuto;
        const monthlyProfit = 30 * dailyProfit;
        const monthlyRevenue = banhistas * valorSugerido * 30;
        const marginPercent = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

        // Update UI with color feedback for losses
        if (revenueDisplay) {
            revenueDisplay.innerText = monthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            revenueDisplay.classList.toggle('negative', monthlyRevenue < 0);
        }
        if (profitDisplay) {
            profitDisplay.innerText = monthlyProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            profitDisplay.classList.toggle('negative', monthlyProfit < 0);
        }
        if (marginDisplay) {
            marginDisplay.innerText = `${Math.max(0, marginPercent).toFixed(0)}%`;
            marginDisplay.classList.toggle('negative', marginPercent < 0);
        }
    }

    // Custom UI buttons for +/- (While-pressed support)
    document.querySelectorAll('.ctrl-btn').forEach(btn => {
        let pressInterval;
        let pressDelay;

        const updateValue = () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;

            // Use data attributes for steps/min since we moved to type="text"
            const step = parseFloat(input.getAttribute('data-step')) ||
                (input.getAttribute('type') === 'number' ? parseFloat(input.getAttribute('step')) : 1) || 1;
            const min = parseFloat(input.getAttribute('data-min')) ||
                (input.getAttribute('type') === 'number' ? parseFloat(input.getAttribute('min')) : 0) || 0;

            let val = parseFormattedValue(input.value);

            if (btn.classList.contains('plus')) {
                val += step;
            } else {
                val = Math.max(min, val - step);
            }

            // Apply formatting based on field type
            if (input.id === 'banhistas-dia') {
                input.value = val.toFixed(0);
            } else {
                input.value = formatBRLValue(val);
            }

            calculateROI();
        };

        const stopPress = () => {
            clearTimeout(pressDelay);
            clearInterval(pressInterval);
        };

        const startPress = (e) => {
            e.preventDefault();
            updateValue();

            pressDelay = setTimeout(() => {
                pressInterval = setInterval(updateValue, 100);
            }, 500);
        };

        btn.addEventListener('mousedown', startPress);
        btn.addEventListener('mouseup', stopPress);
        btn.addEventListener('mouseleave', stopPress);

        btn.addEventListener('touchstart', startPress, { passive: false });
        btn.addEventListener('touchend', stopPress);
        btn.addEventListener('touchcancel', stopPress);
    });

    // Formatting on manual input blur
    [valorInput, metroCubicoInput].forEach(input => {
        if (input) {
            input.addEventListener('blur', () => {
                let val = parseFormattedValue(input.value);
                const min = parseFloat(input.getAttribute('data-min')) || 0;
                val = Math.max(min, val);
                input.value = formatBRLValue(val);
                calculateROI();
            });
            input.addEventListener('input', calculateROI);
        }
    });

    if (banhistasInput) {
        banhistasInput.addEventListener('input', calculateROI);
        banhistasInput.addEventListener('blur', () => {
            let val = parseInt(banhistasInput.value) || 0;
            const min = parseInt(banhistasInput.getAttribute('min')) || 1;
            banhistasInput.value = Math.max(min, val);
            calculateROI();
        });
    }

    // Contact Form (Lead Capture)
    document.getElementById('contact-form')?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const barraca = document.getElementById('barraca').value;
        const whatsapp = document.getElementById('whatsapp').value;

        const btn = this.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Processando...';
        btn.disabled = true;

        try {
            const response = await fetch('https://api.paguepix.oficinabr.com/auth/public/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email: '', barraca, whatsapp })
            });

            if (response.ok) {
                const data = await response.json();
                // Redirect to demo login in the frontend with session params
                const params = new URLSearchParams({
                    token: data.token,
                    userId: data.userId,
                    role: data.role,
                    name: data.name,
                    partnerId: data.partnerId || '',
                    partnerName: data.partnerName || ''
                });
                window.location.href = `https://paguepix.oficinabr.com/auth/demo-login?${params.toString()}`;
            } else {
                throw new Error('Erro ao salvar lead');
            }
        } catch (error) {
            console.error(error);
            // Fallback to WhatsApp if API fails
            sendToWhatsApp();
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });

    // Initial run
    updateWaterCost();
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
