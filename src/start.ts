import app from './app';

const port = 8000;
const host = 'localhost';

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});
