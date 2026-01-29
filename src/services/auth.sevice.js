import logger from '#config/logger';
import { db } from '#config/database';
import {eq} from 'drizzle-orm';
import { users } from '#models/user.model';

export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const bcrypt = await import('bcrypt');
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        logger.error('Error hashing password:', error);
        throw new Error('Error hashing password: ' + error.message);
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        const bcrypt = await import('bcrypt');
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        logger.error('Error comparing password:', error);
        throw new Error('Error comparing password: ' + error.message);
    }
}

export const createUser = async (name, email, password, role='user') => {
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0 ) {
            throw new Error('user already exists');
        }
        const hashedPassword = await hashPassword(password);
        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role
        }).returning({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt });
        logger.info(`User ${newUser.email} created successfully`);
        return newUser;
    } catch (error) {
        logger.error('Error creating user:', error);
        throw new Error('Error creating user: ' + error.message);
    }
}

export const authenticateUser = async (email, password) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user) {
            throw new Error('user not found');
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error('invalid credentials');
        }
        const { password: _password, ...safeUser } = user;
        return safeUser;
    } catch (error) {
        logger.error('Error authenticating user:', error);
        throw new Error('Error authenticating user: ' + error.message);
    }
}
