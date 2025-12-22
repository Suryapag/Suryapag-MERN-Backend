const auth = require('../controllers/authController');
const { Router } = require('express');
const app = Router();


app.post('/login', auth.login);
app.post('/register', auth.register);
app.get('/users', auth.getUsers);
app.post('/rolecreate', auth.roleCreate);


module.exports = app;