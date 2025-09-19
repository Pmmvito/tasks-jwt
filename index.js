const express = require('express');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

db.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/task', require('./routes/taskRoutes'));
app.set('view engine', 'ejs');
app.set('views', './views');
// app.set('view', './views');
// app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/tasks', (req, res) => {
  res.render('task', { title: 'Tasks' });
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
