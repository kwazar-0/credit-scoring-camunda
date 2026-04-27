# CI/CD Pipeline

## Этапы

1. Build и package.
2. Test и проверки качества.
3. Security scanning.
4. Публикация неизменяемого артефакта.
5. Развёртывание по контуру promotion.

## Promotion

- `dev`: автоматически после merge.
- `stage`: ручной gate + интеграционные проверки.
- `prod`: двойное согласование + контролируемый rollout.
