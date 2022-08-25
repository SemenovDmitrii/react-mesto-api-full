const allowedCors = [
  'http://sdv.nomoredomains.sbs',
  'https://sdv.nomoredomains.sbs',
  'http://api.sdv.nomoredomains.sbs',
  'https://api.sdv.nomoredomains.sbs',
  'https://www.api.sdv.nomoredomains.sbs',
  'http://www.api.sdv.nomoredomains.sbs',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
    return;
  }
  next();
});