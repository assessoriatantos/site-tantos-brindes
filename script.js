function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq__item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

function submitHeroForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Enviado! Entraremos em contato.';
  btn.style.background = '#1F3D2B';
  btn.disabled = true;
}

function submitQuoteForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Solicitação enviada! Aguarde nosso contato.';
  btn.style.background = '#1F3D2B';
  btn.disabled = true;
}

// ===================== MULTI-STEP FORM =====================
let msCurrentStep = 1;
const MS_TOTAL = 6;

function msGoTo(step) {
  document.querySelectorAll('.ms-step').forEach(el => el.classList.remove('active'));
  document.getElementById('ms-step-' + step).classList.add('active');

  const btnNext   = document.getElementById('ms-btn-next');
  const btnSubmit = document.getElementById('ms-btn-submit');
  const btnBack   = document.getElementById('ms-btn-back');

  if (step === MS_TOTAL) {
    btnNext.style.display   = 'none';
    btnSubmit.style.display = 'block';
  } else {
    btnNext.style.display   = 'block';
    btnSubmit.style.display = 'none';
  }

  btnBack.disabled = (step === 1);
  msCurrentStep = step;
}

function msValidate(step) {
  if (step === MS_TOTAL) return true;
  const el = document.querySelector('#ms-step-' + step + ' .ms-input, #ms-step-' + step + ' .ms-select');
  if (!el || el.value.trim()) return true;
  el.classList.add('ms-error');
  el.focus();
  setTimeout(() => el.classList.remove('ms-error'), 2000);
  return false;
}

function msNext() {
  if (!msValidate(msCurrentStep)) return;
  if (msCurrentStep < MS_TOTAL) msGoTo(msCurrentStep + 1);
}

function msBack() {
  if (msCurrentStep > 1) msGoTo(msCurrentStep - 1);
}

function msMaskPhone(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d*)$/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d*)$/, '($1) $2');
  } else if (v.length > 0) {
    v = v.replace(/^(\d*)$/, '($1');
  }
  e.target.value = v;
}

const ENDPOINT = 'https://script.google.com/macros/s/AKfycbwEbHufULk7gjw7Is7hfoKOBf8K75gd_a99X2IVS7359HVuxq9JF-mZ5zfvtSl5qi_b/exec';

async function msSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('ms-btn-submit');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  const payload = {
    nome:       document.getElementById('ms-nome').value,
    whatsapp:   document.getElementById('ms-whatsapp').value,
    email:      document.getElementById('ms-email').value,
    produto:    document.getElementById('ms-produto').value,
    quantidade: document.getElementById('ms-quantidade').value,
    segmento:   document.getElementById('ms-segmento').value,
  };

  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });
    ['ms-nome', 'ms-whatsapp', 'ms-email', 'ms-produto', 'ms-quantidade', 'ms-segmento']
      .forEach(id => { document.getElementById(id).value = ''; });
    document.querySelectorAll('.ms-step, .ms-nav-btns, .ms-privacy').forEach(el => el.style.display = 'none');
    document.getElementById('ms-success').classList.add('open');
  } catch (err) {
    btn.textContent = 'Erro ao enviar. Tente novamente.';
    btn.style.background = '#c0392b';
    btn.disabled = false;
  }
}

document.getElementById('ms-whatsapp').addEventListener('input', msMaskPhone);

// Smooth scroll com offset do header fixo
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Sombra no header ao rolar
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(15,42,68,.12)' : '';
});
