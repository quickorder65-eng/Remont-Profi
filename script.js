'use strict';

function trackEvent(eventName, eventData) {
  console.log('Analytics event:', eventName, eventData);
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource:   params.get('utm_source')   || '',
    utmMedium:   params.get('utm_medium')   || '',
    utmCampaign: params.get('utm_campaign') || ''
  };
}

const utmParams = getUtmParams();

let leadData = {
  name:        '',
  phone:       '',
  source:      '',
  objectType:  '',
  area:        '',
  repairType:  '',
  packageType: '',
  startTime:   '',
  priority:    '',
  message:     '',
  pageUrl:     window.location.href,
  createdAt:   '',
  utmSource:   utmParams.utmSource,
  utmMedium:   utmParams.utmMedium,
  utmCampaign: utmParams.utmCampaign
};

function sendLeadToCRM(data) {
  data.createdAt = new Date().toISOString();
  data.pageUrl   = window.location.href;

  console.log('=== LEAD ===', JSON.stringify(data, null, 2));

  trackEvent('lead_submit', data);
}

function formatLeadMessage(data) {
  return `<b>Новая заявка с сайта RemontProfi</b>
Имя: ${data.name}
Телефон: ${data.phone}
Источник: ${data.source}
Объект: ${data.objectType}
Площадь: ${data.area}
Тип ремонта: ${data.repairType}
Пакет: ${data.packageType}
Начало: ${data.startTime}
Приоритет: ${data.priority}
UTM: ${data.utmSource} / ${data.utmMedium} / ${data.utmCampaign}
Время: ${data.createdAt}`;
}

const TOTAL_STEPS = 6;
let currentStep = 1;

const quizAnswers = {
  objectType:  '',
  area:        '',
  repairType:  '',
  packageType: '',
  startTime:   '',
  priority:    ''
};

function selectOption(btn, step) {

  const siblings = btn.parentElement.querySelectorAll('.quiz__option');
  siblings.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  const field = btn.dataset.field;
  const value = btn.dataset.value;
  quizAnswers[field] = value;
  leadData[field] = value;

  trackEvent('quiz_step_' + step, { step, field, value });

  setTimeout(() => {
    if (step < TOTAL_STEPS) {
      goToStep(step + 1);
    } else {

      trackEvent('quiz_complete', quizAnswers);
      showSummary();
    }
  }, 260);
}

function goToStep(stepNum) {

  document.querySelectorAll('.quiz__step').forEach(s => s.classList.remove('active'));

  const target = document.getElementById('quizStep' + stepNum);
  if (target) {
    target.classList.add('active');
  }

  currentStep = stepNum;
  updateProgress(stepNum, TOTAL_STEPS);
}

function updateProgress(current, total) {
  const pct = Math.round((current / total) * 100);
  const fill = document.getElementById('quizProgressFill');
  const label = document.getElementById('quizProgressLabel');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = 'Шаг ' + current + ' из ' + total;
}

function showSummary() {
  document.querySelectorAll('.quiz__step').forEach(s => s.classList.remove('active'));
  const summary = document.getElementById('quizSummary');
  if (summary) summary.classList.add('active');

  const container = document.getElementById('summaryAnswers');
  if (container) {
    const labels = {
      objectType:  quizAnswers.objectType  || '—',
      area:        quizAnswers.area        || '—',
      repairType:  quizAnswers.repairType  || '—',
      packageType: quizAnswers.packageType || '—',
      startTime:   quizAnswers.startTime   || '—',
      priority:    quizAnswers.priority    || '—'
    };
    container.innerHTML = Object.values(labels)
      .filter(v => v !== '—')
      .map(v => `<span class="summary__tag">${v}</span>`)
      .join('');
  }

  const progressWrap = document.querySelector('.quiz__progress-wrap');
  if (progressWrap) progressWrap.style.display = 'none';
}

function showQuizForm() {
  document.querySelectorAll('.quiz__step').forEach(s => s.classList.remove('active'));
  const formStep = document.getElementById('quizFormStep');
  if (formStep) formStep.classList.add('active');
}

function submitQuizForm(event) {
  event.preventDefault();

  const nameInput  = document.getElementById('quizName');
  const phoneInput = document.getElementById('quizPhone');
  const nameErr    = document.getElementById('quizNameError');
  const phoneErr   = document.getElementById('quizPhoneError');

  let valid = true;

  if (!nameInput.value.trim()) {
    nameInput.classList.add('error');
    nameErr.classList.add('visible');
    valid = false;
  } else {
    nameInput.classList.remove('error');
    nameErr.classList.remove('visible');
  }

  const digits = phoneInput.value.replace(/\D/g, '');
  if (digits.length < 10) {
    phoneInput.classList.add('error');
    phoneErr.classList.add('visible');
    valid = false;
  } else {
    phoneInput.classList.remove('error');
    phoneErr.classList.remove('visible');
  }

  if (!valid) return;

  const lead = Object.assign({}, leadData, {
    name:   nameInput.value.trim(),
    phone:  phoneInput.value.trim(),
    source: 'quiz',
    objectType:  quizAnswers.objectType,
    area:        quizAnswers.area,
    repairType:  quizAnswers.repairType,
    packageType: quizAnswers.packageType,
    startTime:   quizAnswers.startTime,
    priority:    quizAnswers.priority
  });

  sendLeadToCRM(lead);

  document.querySelectorAll('.quiz__step').forEach(s => s.classList.remove('active'));
  const success = document.getElementById('quizSuccess');
  if (success) success.classList.add('active');
}

function submitFinalForm(event) {
  event.preventDefault();

  const nameInput = document.getElementById('ctaName');
  const phoneInput = document.getElementById('ctaPhone');
  const nameErr   = document.getElementById('ctaNameError');
  const phoneErr  = document.getElementById('ctaPhoneError');

  let valid = true;

  if (!nameInput.value.trim()) {
    nameInput.classList.add('error');
    nameErr.classList.add('visible');
    valid = false;
  } else {
    nameInput.classList.remove('error');
    nameErr.classList.remove('visible');
  }

  const digits = phoneInput.value.replace(/\D/g, '');
  if (digits.length < 10) {
    phoneInput.classList.add('error');
    phoneErr.classList.add('visible');
    valid = false;
  } else {
    phoneInput.classList.remove('error');
    phoneErr.classList.remove('visible');
  }

  if (!valid) return;

  const lead = Object.assign({}, leadData, {
    name:   nameInput.value.trim(),
    phone:  phoneInput.value.trim(),
    source: 'final_form'
  });

  sendLeadToCRM(lead);

  const form    = document.getElementById('finalCtaForm');
  const success = document.getElementById('finalFormSuccess');
  if (form)    form.style.display = 'none';
  if (success) success.style.display = 'block';

  setTimeout(() => {
    if (form)    form.style.display = '';
    if (success) success.style.display = 'none';
    nameInput.value = '';
    phoneInput.value = '';
  }, 8000);
}

let chatOpen = false;
let chatGreeted = false;

function toggleChat() {
  if (chatOpen) {
    closeChat();
  } else {
    openChat();
  }
}

function openChat() {
  const win = document.getElementById('chatWindow');
  if (win) {
    win.style.display = 'flex';

    win.style.animation = 'none';
    void win.offsetWidth;
    win.style.animation = 'slideUp .22s ease';
  }
  chatOpen = true;
  trackEvent('bot_open', {});

  if (!chatGreeted) {
    chatGreeted = true;
    setTimeout(() => {
      addBotMessage('Здравствуйте! Я помогу сориентироваться по ремонту: стоимость, сроки, смета, этапы и заявка в WhatsApp.');
    }, 100);
  }
}

function closeChat() {
  const win = document.getElementById('chatWindow');
  if (win) win.style.display = 'none';
  chatOpen = false;
}

function addBotMessage(text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'chat-msg chat-msg--bot';
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'chat-msg chat-msg--user';
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function addBotLink(text, href) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'chat-msg chat-msg--bot';
  msg.innerHTML = text + (href ? ` <a href="${href}" style="color:var(--clr-accent);text-decoration:underline;display:block;margin-top:8px;" target="_blank" onclick="trackEvent('whatsapp_click',{location:'chat'})">${href.startsWith('https://wa.me') ? '→ Написать в WhatsApp' : '→ Подробнее'}</a>` : '');
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

const chatResponses = {
  calc: {
    user: 'Рассчитать стоимость',
    bot:  'Отлично! Пройдите короткий квиз — 6 вопросов — и мы подготовим предварительную вилку бюджета по вашему объекту.',
    link: '#quiz'
  },
  estimate_q: {
    user: 'Что входит в смету?',
    bot:  'В смету обычно входят: демонтаж, черновые работы, электрика, сантехника, чистовые материалы, работа мастеров, доставка и непредвиденные расходы. Точный состав зависит от объекта и выбранного пакета.'
  },
  timeline: {
    user: 'Какие сроки ремонта?',
    bot:  'Срок зависит от площади, состояния объекта и типа ремонта. Ориентировочно: небольшая квартира — ~35 рабочих дней, средняя 60 м² — ~55 дней, большая 90 м² — ~75 дней.'
  },
  price_factors: {
    user: 'Что может увеличить цену?',
    bot:  'Чаще всего бюджет растёт из-за: скрытого состояния коммуникаций, дополнительного демонтажа, изменений по ходу работ, выбора дорогих материалов. Мы показываем возможные риски ещё до начала ремонта.'
  },
  cases_q: {
    user: 'Посмотреть объекты',
    bot:  'В разделе «Объекты» на сайте можно посмотреть реальные кейсы с площадью, сроками и бюджетом.',
    link: '#cases'
  },
  contact_q: {
    user: 'Связаться с менеджером',
    bot:  'Оставьте имя и номер — менеджер напишет вам в WhatsApp. Не будем звонить 10 раз.',
    showForm: true
  }
};

function chatQuickReply(key) {
  const resp = chatResponses[key];
  if (!resp) return;

  trackEvent('bot_quick_reply_click', { key });

  addUserMessage(resp.user);

  const qr = document.getElementById('chatQuickReplies');

  setTimeout(() => {
    if (resp.link) {
      addBotLink(resp.bot, resp.link);
    } else {
      addBotMessage(resp.bot);
    }

    if (resp.showForm) {
      const form = document.getElementById('chatContactForm');
      if (form) form.style.display = 'flex';
    }
  }, 550);
}

function submitChatContactForm(event) {
  event.preventDefault();

  const nameInput  = document.getElementById('chatName');
  const phoneInput = document.getElementById('chatPhone');

  const digits = phoneInput.value.replace(/\D/g, '');
  if (!nameInput.value.trim() || digits.length < 10) {
    addBotMessage('Пожалуйста, введите имя и корректный номер телефона.');
    return;
  }

  const lead = Object.assign({}, leadData, {
    name:    nameInput.value.trim(),
    phone:   phoneInput.value.trim(),
    source:  'chat',
    message: 'Запрос через помощника по смете'
  });

  sendLeadToCRM(lead);
  trackEvent('bot_lead', lead);

  const form = document.getElementById('chatContactForm');
  if (form) form.style.display = 'none';

  addBotMessage('Заявка принята! Менеджер свяжется с вами в WhatsApp.');

  setTimeout(() => {
    addBotLink(
      'Или вы можете написать нам прямо сейчас:',
      'https://wa.me/77775127772?text=Здравствуйте,%20я%20обращался%20через%20сайт'
    );
  }, 600);
}

function toggleMobileNav() {
  const nav     = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  const burger  = document.getElementById('burgerBtn');

  nav.classList.toggle('open');
  overlay.classList.toggle('show');
  burger.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}

function closeMobileNav() {
  const nav     = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  const burger  = document.getElementById('burgerBtn');

  nav.classList.remove('open');
  overlay.classList.remove('show');
  burger.classList.remove('open');
  document.body.style.overflow = '';
}

function toggleFaq(item) {
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

  if (!isOpen) {
    item.classList.add('open');
  }
}

(function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
})();

document.addEventListener('DOMContentLoaded', () => {
  trackEvent('page_view', {
    url: window.location.href,
    referrer: document.referrer,
    utm: utmParams
  });

  trackEvent('quiz_start', {});

  if ('IntersectionObserver' in window) {
    const priceCards = document.querySelectorAll('.price-card');
    const priceObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trackEvent('price_card_view', { visible: true });
          priceObs.unobserve(entry.target);
        }
      });
    }, { threshold: .5 });
    priceCards.forEach(c => priceObs.observe(c));
  }
});

document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  const id = anchor.getAttribute('href').slice(1);
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.addEventListener('input', (e) => {
  if (e.target.type !== 'tel') return;
  let val = e.target.value.replace(/\D/g, '');
  if (val.startsWith('8')) val = '7' + val.slice(1);
  if (val.length > 11) val = val.slice(0, 11);

  if (val.length > 0) {
    let formatted = '+' + val[0];
    if (val.length > 1)  formatted += ' (' + val.slice(1, 4);
    if (val.length > 4)  formatted += ') ' + val.slice(4, 7);
    if (val.length > 7)  formatted += '-' + val.slice(7, 9);
    if (val.length > 9)  formatted += '-' + val.slice(9, 11);
    if (val.length >= 2 && val.length <= 3) formatted += ')';
    e.target.value = formatted;
  }
});
