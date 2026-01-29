import logger from "#config/logger";
import { authenticateUser, createUser } from "#services/auth.sevice";
import { formatvalidationError } from "#utils/format";
import { signinschema, signupschema } from "#validations/auth.validation";
import { jwtotken } from "#utils/jwt";
import { cookies } from "#utils/cookies";

export const signup = async (req, res, next) => {
    try {
        const validationResult = signupschema.safeParse(req.body);
        if (!validationResult.success) {
            const formattedError = formatvalidationError(validationResult.error);
            logger.warn('Validation error during signup: ' + formattedError);
            return res.status(400).send('Validation error: ' + formattedError);
        }
        const { name, email, role } = validationResult.data;
        const user = await createUser(name, email, validationResult.data.password, role);
        const token = jwtotken.sign({ id: user.id, email: user.email, role: user.role });
        cookies.set(res, 'token', token);
        logger.info(`User signed up: ${user.email} with role: ${user.role}`);
        res.status(201).send(`User ${user.name} signed up successfully with email: ${user.email} and role: ${user.role}`);
    } catch (error) {
        logger.error('Error in signup controller:', error);
        if (error.message?.includes('user already exists')) {
            res.status(409).send('User already exists');
        }
        next(error);
    }
};

export const signin = async (req, res, next) => {
    try {
        const validationResult = signinschema.safeParse(req.body);
        if (!validationResult.success) {
            const formattedError = formatvalidationError(validationResult.error);
            logger.warn('Validation error during signin: ' + formattedError);
            return res.status(400).send('Validation error: ' + formattedError);
        }
        const { email, password } = validationResult.data;
        const user = await authenticateUser(email, password);
        const token = jwtotken.sign({ id: user.id, email: user.email, role: user.role });
        cookies.set(res, 'token', token);
        logger.info(`User signed in: ${user.email} with role: ${user.role}`);
        res.status(200).send(`User ${user.email} signed in successfully`);
    } catch (error) {
        logger.error('Error in signin controller:', error);
        if (error.message?.includes('user not found') || error.message?.includes('invalid credentials')) {
            return res.status(401).send('Invalid email or password');
        }
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        cookies.clear(res, 'token');
        logger.info('User signed out');
        res.status(200).send('Signed out successfully');
    } catch (error) {
        logger.error('Error in signout controller:', error);
        next(error);
    }
};
