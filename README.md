# ООО «РЕГАРД» — сайт

Сайт: https://www.regard-spb.ru/

CMS: https://www.regard-spb.ru/admin/

GitHub repository: `Seculent/Regard-Site`

Production branch: `main`

## Архитектура

Сайт работает как статический frontend.

Основные части:

- `index.html` — главная страница
- `css/` — стили
- `javascript/` — frontend-логика
- `content/projects.json` — объекты
- `content/news.json` — новости
- `JPG/` — изображения сайта
- `JPG/uploads/` — изображения из CMS
- `PDF/` — документы
- `admin/` — Sveltia CMS
- `scripts/` — проверки
- `.github/workflows/` — GitHub Actions

CMS работает по схеме:

Sveltia CMS → Cloudflare OAuth Worker → GitHub → main

Секреты OAuth в repository не хранятся.

## Перед локальным push

Всегда сначала:

    git fetch origin main
    git status
    git rev-parse HEAD
    git rev-parse origin/main

Если HEAD и origin/main отличаются — сначала выяснить причину.

CMS может самостоятельно создать новый commit в main.

Никогда не использовать force push.

## Проверки перед commit

    node scripts/validate-site.mjs
    node scripts/check-content.mjs
    git diff --check
    git diff
    git status

## После push

Проверить:

- HEAD == origin/main
- worktree clean
- GitHub Pages deployment
- production-сайт

При необходимости:

    node scripts/check-production.mjs

## Восстановление

Подробная инструкция:

`RECOVERY.md`

Главное правило: не переписывать опубликованную историю main.

## Текущий стабильный checkpoint

Текущий checkpoint всегда определяется из Git:

    git log -1 --oneline

Опубликованный `main` является source of truth.

## Roadmap

Завершены:

- C4 — Content Integrity / Frontend Hardening
- C5 — SEO / Performance / Accessibility
- C6 — Operational Reliability
- C7 — Security
- C8 — Backup / Recovery
- C9 — CMS Owner Experience
- C10 — Monitoring / Analytics
- C13 — Performance Phase 2

Отложен:

- C11 — SEO Growth / Content Architecture

Пропущен как ненужный сейчас:

- C12 — Conversion / UX Improvement

Документация и сопровождение:

- C14 — Maintenance / Documentation / Handoff