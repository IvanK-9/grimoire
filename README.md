# 🧙‍♂️ Blood on the Clocktower — Pocket Grimoire (MVP)

[![CI](https://github.com/IvanK-9/grimoire/actions/workflows/ci.yml/badge.svg)](https://github.com/IvanK-9/grimoire/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ivank-9.github.io/grimoire/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com/)
[![Oxlint](https://img.shields.io/badge/linter-oxlint-orange)](https://oxc.rs/)

> Компактный, быстрый и мобильный веб-помощник ведущего (Storyteller) для настольной игры **Blood on the Clocktower**. Оптимизирован для реальных офлайн-игр и работы со смартфона в темноте.

🌐 **Рабочее демо (GitHub Pages):** [https://ivank-9.github.io/grimoire/](https://ivank-9.github.io/grimoire/)

---

## 🎯 Зачем этот проект?

Существующие цифровые помощники имеют ключевые проблемы UX при ведении живых игр:
1. **[botc.games/play](https://botc.games/play):** Неудобный UX для живого стола — требует сначала вводить имена всех игроков, и только потом назначать роли.
2. **BOTCH (Google Play):** Устаревший и перегруженный интерфейс.
3. **Отсутствие механики Пьяницы (Drunk):** Ни одно из популярных приложений не позволяет прямо на этапе сбора мешка назначить фальшивый жетон Горожанина (*Townsfolk disguise*), который ведущий физически кладет в мешок вместо жетона Пьяницы.

**BotC Pocket Grimoire** решает именно эти задачи: ведущий собирает мешок, выбирает маскировку для Пьяницы, а затем в 1 тап распределяет роли по местам прямо по ходу того, как игроки физически тянут жетоны.

---

## ✨ Реализованный функционал (MVP)

- 📜 **Поддержка официальных скриптов:**
  - Встроена классическая редакция **Trouble Brewing** (22 роли).
  - Кнопка **Load JSON** поддерживает импорт сценариев напрямую из официального редактора [script.bloodontheclocktower.com](https://script.bloodontheclocktower.com/) (поддерживаются как массивы ID, так и объекты с метаданными).
- 🎒 **1. Bag (Сборка мешка):**
  - Быстрый выбор ролей с цветовой группировкой по командам (*Townsfolk, Outsider, Minion, Demon*).
  - **Авто-контроль Пьяницы (Drunk):** если выбран Drunk, приложение обязывает выбрать непопавшего в игру Горожанина для физической маскировки в мешке.
  - Индикатор количества игроков и готовности мешка.
- 🪑 **2. Seats (Рассадка в 1 тап):**
  - Автоматическое создание мест по количеству ролей в мешке.
  - Назначение вытянутого жетона в 1 клик через удобное модальное окно.
  - Имена игроков опциональны — их можно ввести сразу или дополнить позже.
  - Ведущий видит реальную роль: при вытягивании маскировки Пьяницы отображается плашка **DRUNK**.
  - Список оставшихся неназначенных жетонов в мешке в реальном времени.

---

## 🛠 Технологический стек

* **Frontend:** [React 19](https://react.dev/)
* **Bundler & Dev Server:** [Vite 8](https://vite.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
* **Linter:** [Oxlint](https://oxc.rs/) (ультрабыстрый Rust-линтер)
* **CI/CD:** GitHub Actions (авто-проверка `oxlint` + `build` на каждый push/PR) + `gh-pages`

---

## 🚀 Быстрый старт

### Требования
* [Node.js](https://nodejs.org/) v20+ (рекомендуется v22+)
* npm v10+

### Установка и запуск

```bash
# Клонировать репозиторий
git clone https://github.com/IvanK-9/grimoire.git
cd grimoire

# Установить зависимости
npm install

# Запуск dev-сервера с HMR
npm run dev

# Проверка линтером (Oxlint)
npm run lint

# Сборка production-бандла
npm run build

# Локальный предпросмотр продакшн-сборки
npm run preview
```

### Деплой
Деплой продакшн-сборки на GitHub Pages:
```bash
npm run deploy
```

---

## 📁 Структура проекта

```text
grimoire/
├── .github/
│   └── workflows/
│       └── ci.yml               # CI пайплайн (линтер oxlint + сборка vite build)
├── human_input/                 # ⚠️ СТРОГО READ-ONLY ДЛЯ AI (требования человека)
│   └── requirements.md          # Зафиксированные решения команды и требования к MVP
├── src/
│   ├── assets/                  # Графика и иконки
│   ├── App.jsx                  # Логика приложения (Bag, Seating, Drunk, JSON Loader)
│   ├── index.css                # Подключение Tailwind CSS v4
│   └── main.jsx                 # Точка входа React
├── AGENTS.md                    # Инструкции для AI-агентов (защита human_input)
├── index.html                   # HTML-каркас
├── package.json                 # Зависимости и скрипты
└── vite.config.js               # Конфигурация Vite и Tailwind v4
```

---

## 👥 Правила работы с требованиями (`human_input/`)

В проекте настроена строгая граница между кодом и человеческими требованиями:
* Папка [`human_input/`](./human_input/) содержит исходные формулировки, решения команды и ограничения.
* В файле [`AGENTS.md`](./AGENTS.md) закреплено правило: **любым AI-ассистентам (Gemini, Claude, Copilot) запрещено изменять или перезаписывать файлы в этой директории**. Человеческие договоренности остаются неизменными.

---

## 🩺 Журнал устранения недочётов (Post-Mortem & Fixes)

В ходе первого ревью проекта были выявлены и полностью устранены технические недочёты:

| Было (проблема) | Стало (решение) |
|---|---|
| **Две системы деплоя:** В `package.json` был `gh-pages`, а рядом лежал нерабочий `.gitlab-ci.yml`. | Убран мёртвый `.gitlab-ci.yml`. Настроен полноценный GitHub Actions CI (`.github/workflows/ci.yml`), деплой зафиксирован на GitHub Pages. |
| **CI без проверок:** В пайплайне не запускался линтер. | В CI-пайплайн добавлен обязательный шаг `npm run lint` (Oxlint) перед сборкой. |
| **Мусор в корне:** Случайные файлы генерации `gemini-code-*.yaml` и `gemini-code-*.js`. | Все временные артефакты удалены из репозитория. |
| **Рассинхрон зависимостей (`npm ls` error):** Версии `@vitejs/plugin-react` (^4.3.4) и `oxlint` (^0.15.0) вызывали `ELSPROBLEMS` при установленном Vite 8. | Зависимости в `package.json` синхронизированы с фактическими (`@vitejs/plugin-react@^6.2.1`, `oxlint@^1.91.0`). `npm ls` проходит с кодом 0 без ошибок. |
| **Лишние пакеты:** `@types/react`, `@types/react-dom` (при отсутствии TS) и неиспользуемый `common-tags`. | Лишние пакеты удалены из `devDependencies`. |
| **Пустой README:** Дефолтный шаблон от Vite. | Написан подробный production-ready README с описанием проекта, стека, запуска и архитектурных решений. |
