require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

// User can view all products
app.get('/api/products', (req, res, next) => {
  db.query('SELECT * FROM "products";')
    .then(result => {
      const data = result.rows;
      data.forEach(product => {
        delete product.longDescription;
      });

      res.status(200).json(data);
    })
    .catch(err => {
      next(err);
    });
});

// User can view the details of a single product
app.get('/api/products/:productId', (req, res, next) => {
  const { productId } = req.params;
  if (isNaN(productId) || productId < 0) {
    return next(new ClientError('The productId should be a positive integer', 400));
  }

  db.query(`
    SELECT * 
    FROM "products"
    WHERE "productId" = $1
    `, [productId])
    .then(result => {
      // Return 404 if the product id is not found
      if (result.rows.length === 0) {
        next(new ClientError(`The productId '${productId}' does not exist.`, 404));
      } else {
        res.status(200).json(result.rows[0]);
      }
    })
    .catch(err => {
      next(err);
    });
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
