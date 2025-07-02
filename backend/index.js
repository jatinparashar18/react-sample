import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { delay, readUsersFromFile, writeUsersToFile } from './util.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/users', async (req, res) => {
    try {
        await delay(500);

        const users = await readUsersFromFile();
        const { page = 1, limit = 10, search = '' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        let filteredUsers = users;

        if (search) {
            filteredUsers = users.filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            );
        }
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: paginatedUsers,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: filteredUsers.length,
                pages: Math.ceil(filteredUsers.length / limitNum)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        await delay(300);

        const { id } = req.params;
        const users = await readUsersFromFile();
        const user = users.find(u => u.id === id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        await delay(800);

        const { name, email, phone, address } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
        }

        const users = await readUsersFromFile();

        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        const newUser = {
            id: uuidv4(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : '',
            address: address ? address.trim() : '',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeUsersToFile(users);

        res.status(201).json({
            success: true,
            data: newUser,
            message: 'User created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        await delay(600);

        const { id } = req.params;
        const { name, email, phone, address } = req.body;

        const users = await readUsersFromFile();
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
        }

        const existingUser = users.find(u =>
            u.email.toLowerCase() === email.toLowerCase() && u.id !== id
        );
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        users[userIndex] = {
            ...users[userIndex],
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : '',
            address: address ? address.trim() : '',
            updatedAt: new Date().toISOString()
        };

        await writeUsersToFile(users);

        res.json({
            success: true,
            data: users[userIndex],
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await delay(400);

        const { id } = req.params;
        const users = await readUsersFromFile();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const deletedUser = users.splice(userIndex, 1)[0];
        await writeUsersToFile(users);

        res.json({
            success: true,
            data: deletedUser,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});