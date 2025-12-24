import auth from '../controllers/authController';
import { Router } from 'express';
const app = Router();


app.post('/login', auth.login);
app.post('/register', auth.register);
app.get('/users', auth.getUsers);
app.post('/rolecreate', auth.roleCreate);


export default app;