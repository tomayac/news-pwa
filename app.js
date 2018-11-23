const express = require('express');
const helmet = require('helmet');
const path = require('path');

const indexRouter = require('./routes/index');

const PORT = process.env.PORT || 3000;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(PORT, () => console.log(`News PWA listening on port ${PORT}!`));
