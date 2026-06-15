# Как создать Telegram бота

1. Откройте Telegram и найдите @BotFather
2. Отправьте команду: /newbot
3. Придумайте имя бота (например: "Русский Дом ВШЭ")
4. Придумайте username (например: "russian_house_hse_bot")
5. Скопируйте полученный токен (выглядит как: 1234567890:ABCdefGHIjklmNOPqrstUVwxyz)

6. Вставьте токен в .env.local:
   TELEGRAM_BOT_TOKEN=ваш_токен

7. Перезапустите сервер: npm run dev

8. Начните диалог с ботом: @russian_house_hse_bot

9. Протестируйте команды:
   - /start - приветствие
   - /help - помощь
   - /vnh - информация о ВНЖ
   - /citizenship - информация о гражданстве
   - /docs - список документов
   - /contacts - контакты

Бот готов к работе!
