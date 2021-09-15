import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { startDiscordBot } from './discord.js';
import { setupFirebase } from './firebase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: __dirname + '/../.env' });

const TOKEN = process.env.TOKEN;

const discord = startDiscordBot(TOKEN as string);

setupFirebase(discord.fetchQuotes);
