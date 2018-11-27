const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const spdy = require('spdy');
const http = require('http');

const indexRouter = require('./routes/index');

const PORT = process.env.PORT || 3000;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(cors());
app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const server = spdy.createServer(http.Server, {
  protocols: ['h2'],
  protocol: 'h2',
  ssl: false,
  plain: true
}, app);

console.log(server)

const listener = server.listen(PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

