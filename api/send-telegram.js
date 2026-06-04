export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const data = req.body || {};

    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required'
      });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({
        success: false,
        message: 'Telegram env variables are not configured'
      });
    }

    const message = `
🛠 Новая заявка с сайта RemontProfi

👤 Имя: ${name}
📞 Телефон: ${phone}

📌 Источник: ${data.source || 'Не указан'}

🏠 Объект: ${data.objectType || 'Не указано'}
📐 Площадь: ${data.area || 'Не указано'}
🔧 Тип ремонта: ${data.repairType || 'Не указано'}
📦 Пакет: ${data.packageType || 'Не указано'}
📅 Начало: ${data.startTime || 'Не указано'}
⭐ Важно: ${data.priority || 'Не указано'}

💬 Сообщение: ${data.message || '-'}

🔗 Страница: ${data.pageUrl || 'Не указано'}
🕒 Время: ${data.createdAt || new Date().toISOString()}

UTM Source: ${data.utmSource || '-'}
UTM Medium: ${data.utmMedium || '-'}
UTM Campaign: ${data.utmCampaign || '-'}
`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok) {
      return res.status(500).json({
        success: false,
        message: 'Telegram API error',
        details: telegramResult
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead sent to Telegram'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}