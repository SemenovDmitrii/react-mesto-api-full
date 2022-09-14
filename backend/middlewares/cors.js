const allowedCors = [
  'http://sdv.nomoredomains.sbs',
  'https://sdv.nomoredomains.sbs',
  'http://sdv.nomoredomains.sbs/cards',
  'https://sdv.nomoredomains.sbs/cards',
  'http://sdv.nomoredomains.sbs/users/me',
  'https://sdv.nomoredomains.sbs/users/me',
  'http://api.sdv.nomoredomains.sbs',
  'https://api.sdv.nomoredomains.sbs',
  'http://api.sdv.nomoredomains.sbs/cards',
  'https://api.sdv.nomoredomains.sbs/cards',
  'http://api.sdv.nomoredomains.sbs/users/me',
  'https://api.sdv.nomoredomains.sbs/users/me',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
];

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
};
