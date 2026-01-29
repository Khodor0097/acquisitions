import { signup, signin, signout } from '#controllers/auth.controller';
import express from 'express';

const router = express.Router();

// Example route for authentication
router.post('/sign-up', signup);

router.get('/sign-up', (req, res) => {
    // Authentication logic goes here
    res.status(200).send('GET /auth/sign-up response');
});

router.get('/sign-in', (req, res) => {
    // Authentication logic goes here
    res.status(200).send('GET /auth/sign-in response');
});

router.post('/sign-in', signin);

router.get('/sign-out', (req, res) => {
    // Authentication logic goes here
    res.status(200).send('GET /auth/sign-out response');
});

router.post('/sign-out', signout);

export default router;
