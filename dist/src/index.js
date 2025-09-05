import express from 'express';
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Restaurant DB API');
});
app.post('/categories', (req, res) => {
    res.send('categories');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map