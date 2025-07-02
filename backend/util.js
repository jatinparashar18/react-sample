
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'users.json');

export async function readUsersFromFile() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export async function writeUsersToFile(users) {
    await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
