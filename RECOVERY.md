# РЕГАРД — восстановление сайта

Репозиторий: `Seculent/Regard-Site`

Production-ветка: `main`

Сайт: `https://www.regard-spb.ru/`

CMS: `https://www.regard-spb.ru/admin/`

## Главное правило

CMS публикует изменения непосредственно в `main`.

Поэтому никогда не использовать:

- `git push --force`
- `git push --force-with-lease`
- переписывание опубликованной истории ради отката

Правильный способ восстановления — создать новый исправляющий commit.

## Перед локальным push

Сначала выполнить:

    git fetch origin main
    git status
    git rev-parse HEAD
    git rev-parse origin/main

Если HEAD и origin/main различаются, сначала выяснить причину.

CMS могла создать новый commit с объектом, новостью или изображением.

Такой commit нельзя перезаписывать.

## Откат неудачного frontend commit

Посмотреть историю:

    git log --oneline -10

Создать безопасный обратный commit:

    git revert <BAD_COMMIT_SHA>

После этого проверить:

    node scripts/check-content.mjs
    node scripts/validate-site.mjs
    git diff --check
    git status

После успешных проверок выполнить обычный push без force.

## Восстановление объектов

Посмотреть историю:

    git log --oneline -- content/projects.json

Просмотреть нужную версию:

    git show <GOOD_COMMIT_SHA>:content/projects.json

Восстановить только файл объектов:

    git restore --source=<GOOD_COMMIT_SHA> -- content/projects.json

Проверить:

    node scripts/check-content.mjs
    git diff -- content/projects.json
    git diff --check
    git status

После проверки создать обычный commit восстановления.

Не откатывать весь repository ради одного файла.

## Восстановление новостей

Посмотреть историю:

    git log --oneline -- content/news.json

Восстановить:

    git restore --source=<GOOD_COMMIT_SHA> -- content/news.json

Проверить:

    node scripts/check-content.mjs
    git diff -- content/news.json
    git diff --check
    git status

После проверки создать обычный commit восстановления.

## Восстановление CMS-изображения

CMS сохраняет изображения в:

`JPG/uploads`

Посмотреть историю конкретного файла:

    git log --oneline -- "JPG/uploads/<FILE>"

Восстановить конкретный файл:

    git restore --source=<GOOD_COMMIT_SHA> -- "JPG/uploads/<FILE>"

Не восстанавливать весь каталог JPG без необходимости.

В нём могут находиться более новые актуальные изображения.

## Если CMS изменила main во время локальной работы

Не использовать force push.

Выполнить:

    git fetch origin main
    git status
    git log --oneline --left-right HEAD...origin/main

После этого отдельно определить локальные изменения и изменения CMS.

Корректный CMS-контент необходимо сохранить.

После объединения изменений снова запустить валидаторы.

## Проверка перед commit

Минимальный набор:

    git diff
    git diff --check
    git status
    node scripts/check-content.mjs
    node scripts/validate-site.mjs

Дополнительно проверить:

- UTF-8
- отсутствие неожиданного BOM
- отсутствие mojibake / закорючек
- staged diff

## После push

Дождаться успешного GitHub Pages deployment.

Затем выполнить:

    node scripts/check-production.mjs

Также проверить:

- главную страницу
- `/admin/`
- `content/projects.json`
- `content/news.json`

## Исторический checkpoint до C8

Checkpoint:

`daadfb954e487544ff3325491aaa8f5e4120d43b`

Commit:

`Improve search snippet and responsive hero behavior`

До C8 папка `backup-old-version` находилась в Git на этом checkpoint.

После удаления из актуального main её содержимое остаётся доступно через Git history.

Дополнительно перед удалением создаётся ZIP-копия на рабочем столе.

## Если есть сомнения

1. Не использовать force push.
2. Выполнить `git fetch origin main`.
3. Проверить `git status`.
4. Найти последний хороший commit.
5. Восстанавливать только нужные файлы.
6. Запустить валидаторы.
7. Создать новый обычный commit восстановления.