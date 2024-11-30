import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'
import bodyparser from 'body-parser';


const prisma = new PrismaClient();


dotenv.config();

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.post('/create', async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await prisma.user.create({
            data: {
                email,
                password
            }

        })
        res.send("User created successfully");
    } catch (err) {
        console.log(err);
    }
});

app.delete('/delete', async (req, res) => {
    const { id } = req.body;
    const user = await prisma.user.delete({
        where: {
            id: id
        }
    });
    res.json(user);
});







app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


