import express from 'express';
import categoriesRouter from './routes/categories.js';
const app = express();
const port = 3000;
app.use(express.json());
app.use('/categories', categoriesRouter);
app.get('/', (req, res) => {
    res.send('Restaurant DB API');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map