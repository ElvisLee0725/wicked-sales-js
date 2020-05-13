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

// GET endpoint for /api/cart
app.get('/api/cart', (req, res, next) => {
  // Case 1: req.session.cartId doesn't exist, return empty array:
  if (!req.session.cartId) {
    res.json([]);
  } else {
    // Case 2: Get all items that user has added to cart with the cartId:
    db.query(`
      SELECT "c"."cartItemId",
             "c"."price",
             "p"."productId",
             "p"."image",
             "p"."name",
             "p"."shortDescription"
      FROM "cartItems" AS "c"
      JOIN "products" AS "p" USING ("productId")
      WHERE "c"."cartId" = $1
    `, [req.session.cartId])
      .then(result => {
        res.status(200).json(result.rows);
      })
      .catch(err => {
        next(err);
      });
  }

});

// POST endpoint for /api/cart. User can add a cart and cartItems into the cart
app.post('/api/cart', (req, res, next) => {
  const { productId } = req.body;
  if (isNaN(productId) || productId < 0) {
    return next(new ClientError('The productId should be a positive integer', 400));
  }

  db.query(`
    SELECT "price"
    FROM "products"
    WHERE "productId" = $1;
  `, [productId])
    .then(result => {
      // Return 400 if that productId is not found
      if (result.rows.length === 0) {
        throw new ClientError(`The price with productId '${productId}' cannot be found.`, 400);
      } else {
        const price = result.rows[0].price;

        // Use return to pass cartId and price to the next .then()
        // Only insert new cartId when the session has no cartId currently; Otherwise, just use the current cartId
        if (!req.session.cartId) {
          return db.query(`
            INSERT INTO "carts" ("cartId", "createdAt")
            VALUES (default, default)
            RETURNING "cartId";
          `).then(result => {
            return {
              cartId: result.rows[0].cartId,
              price
            };
          }).catch(err => {
            next(err);
          });
        } else {
          return {
            cartId: req.session.cartId, // Use the same cartId in the same session
            price
          };
        }
      }
    })
    .then(data => {
      req.session.cartId = data.cartId;

      // Use return to pass cartItemId to the next .then() after insert
      return db.query(`
        INSERT INTO "cartItems" ("cartId", "productId", "price")
        VALUES ($1, $2, $3)
        RETURNING "cartItemId";
      `, [data.cartId, productId, data.price])
        .then(result => {
          return result.rows[0].cartItemId;
        })
        .catch(err => {
          next(err);
        });
    })
    .then(cartItemId => {
      // Get columns of the cartItemId which is just added to cart
      db.query(`
        SELECT "c"."cartItemId",
                "c"."price",
                "p"."productId",
                "p"."image",
                "p"."name",
                "p"."shortDescription"
        FROM "cartItems" AS "c"
        JOIN "products" AS "p" USING ("productId")
        WHERE "c"."cartItemId" = $1;
      `, [cartItemId])
        .then(result => {
          // Respond 201 with the cart item
          res.status(201).json(result.rows[0]);
        })
        .catch(err => {
          next(err);
        });
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
