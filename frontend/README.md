# Student Portal Frontend

React-приложение для личного кабинета студента.

## Установка

```bash
npm install
```

## Запуск

### Development
```bash
npm start
```

Откроется на http://localhost:3000

### Production Build
```bash
npm run build
```

## Переменные окружения

Создайте файл `.env` в корне папки frontend:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

## Структура

```
src/
├── components/          # React компоненты
│   ├── Login.js        # Страница входа
│   ├── StudentDashboard.js
│   └── TeacherDashboard.js
├── services/
│   └── api.js          # API клиент
├── App.js              # Главный компонент
├── App.css             # Глобальные стили
└── index.js            # Точка входа
```

## Технологии

- React 18
- React Router 6
- Axios
- CSS3






