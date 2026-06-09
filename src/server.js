const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(routes);

const PORT = 9000;

app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
});
