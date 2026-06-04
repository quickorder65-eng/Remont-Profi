# RemontProfi — Сайт ремонтной компании

Современный landing page для ремонтной компании в Алматы.
Сделан как система увеличения заявок: квиз → ценность → WhatsApp → CRM.

## Запуск

1. Откройте папку с файлами
2. Откройте `index.html` в браузере двойным кликом
   — или через Live Server в VS Code для полноценной работы
3. Всё работает без сборки, без Node.js, без зависимостей

## Файлы

```
index.html   — HTML-структура сайта (все секции)
style.css    — Стили (переменные, адаптив, компоненты)
script.js    — Логика (квиз, чат, аналитика, CRM-подготовка)
README.md    — Эта инструкция
```

## Что заменить перед передачей клиенту

### Контакты
- [ ] Телефон: найти `+7 (700) 000-00-00` → заменить на реальный
- [ ] WhatsApp: найти `wa.me/77000000000` → заменить на реальный номер
      Комментарий в коде: «Заменить номер на реальный WhatsApp компании»

### Фотографии (плейсхолдеры)
- [ ] Герой: фото готовой кухни-гостиной (`ph--hero`)
- [ ] Кейс 1 (40 м²): фото квартиры после ремонта (`ph--case`)
- [ ] Кейс 2 (60 м²): фото квартиры после ремонта (`ph--case`)
- [ ] Кейс 3 (90 м²): фото квартиры после ремонта (`ph--case`)
- [ ] Отзыв 1: скрин из WhatsApp (`ph--review-wa`)
- [ ] Отзыв 2: скрин из 2ГИС (`ph--review-gis`)
- [ ] Отзыв 3: скрин из Instagram (`ph--review-ig`)
- [ ] Команда: фото руководителя/прораба (`ph--person`)
- [ ] Смета: реальный скрин документа (блок `ph--doc`)

  Для каждого плейсхолдера в HTML есть HTML-комментарий:
  «Заменить этот плейсхолдер на реальное фото объекта»

### Интеграции

#### Telegram-бот
В `script.js` найти раздел `sendLeadToCRM` → раскомментировать блок Telegram:
```js
fetch('https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage', {
  ...
})
```
Заменить `YOUR_BOT_TOKEN` и `YOUR_CHAT_ID`.
**Важно:** токен бота нельзя хранить в открытом JS. Используйте прокси-сервер или n8n.

#### n8n webhook
Раскомментировать:
```js
fetch('YOUR_N8N_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```
Заменить `YOUR_N8N_WEBHOOK_URL` на URL вашего webhook.

#### Google Sheets
Через Google Apps Script или n8n.
Раскомментировать блок `Send to Google Sheets`.

#### amoCRM / Kommo / Bitrix24
Раскомментировать соответствующий блок в `sendLeadToCRM`.
Заменить URL и токены на реальные.

#### Google Analytics 4
В `trackEvent` раскомментировать:
```js
gtag('event', eventName, eventData);
```
Добавить скрипт GA4 в `<head>` `index.html`.

#### Яндекс Метрика
Раскомментировать:
```js
ym(YOUR_METRIKA_ID, 'reachGoal', eventName, eventData);
```
Добавить скрипт Метрики в `<head>`.

#### Google Tag Manager
Раскомментировать `dataLayer.push(...)` и добавить GTM-контейнер.

### Отслеживаемые события (уже готовы)

| Событие | Когда срабатывает |
|---|---|
| `page_view` | Загрузка страницы |
| `hero_cta_click` | Клик «Рассчитать стоимость» |
| `secondary_cta_click` | Клик «Посмотреть объекты» |
| `quiz_start` | Загрузка страницы |
| `quiz_step_1..6` | Каждый шаг квиза |
| `quiz_complete` | Завершение всех шагов |
| `lead_submit` | Отправка любой формы |
| `whatsapp_click` | Клик на WhatsApp |
| `phone_click` | Клик на телефон |
| `bot_open` | Открытие чата |
| `bot_quick_reply_click` | Быстрый ответ в чате |
| `bot_lead` | Заявка через чат |
| `case_view` | Просмотр кейса |
| `faq_open` | Открытие FAQ |
| `price_card_view` | Просмотр карточки цены |
| `final_cta_click` | Клик на финальный CTA |
| `nav_click` | Клик по навигации |

### Структура данных лида (leadData)

```json
{
  "name": "",
  "phone": "",
  "source": "quiz | final_form | ai_chat | whatsapp_click",
  "objectType": "Квартира в новостройке | Вторичка | ...",
  "area": "До 40 м² | 40–70 м² | ...",
  "repairType": "Косметический | Капитальный | ...",
  "packageType": "Только работы | Ремонт под ключ | ...",
  "startTime": "Срочно | В течение месяца | ...",
  "priority": "Не выйти за бюджет | ...",
  "message": "",
  "pageUrl": "https://...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "utmSource": "",
  "utmMedium": "",
  "utmCampaign": ""
}
```

## Безопасность

**Никогда не храните в frontend-коде:**
- Токены Telegram-бота
- API-ключи CRM
- Пароли и секреты

Используйте backend (Node.js, n8n, Make, serverless function) как прослойку.

## Технологии

- HTML5 + CSS3 (Custom Properties, Grid, Flexbox)
- JavaScript ES6+ (без фреймворков, без зависимостей)
- Google Fonts (Inter)
- Работает в любом современном браузере

## Что можно добавить

- Реальные фото → заменить плейсхолдеры
- Подключить ИИ-чат (OpenAI / Gemini API через backend)
- Добавить видео-обзоры объектов
- Расширить блок кейсов
- Добавить страницу услуги
- Подключить онлайн-запись на замер
