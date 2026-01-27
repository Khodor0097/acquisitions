import 'dotenv/config.js';

import {neon} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-serverless'; 
import { ne } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);
export default {db,sql};