import express from 'express';
import categoriesRouter from './routes/categories.js';
import productRouter from './routes/products.js';
import ingredientRouter from './routes/ingredients.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/products', productRouter);
app.use('/ingredients', ingredientRouter);

app.get('/', (req, res) => {
  res.send('Restaurant DB API');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
