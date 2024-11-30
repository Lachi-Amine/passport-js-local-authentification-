import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';


// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());



const prisma = new PrismaClient();


// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('Server is up and running!');
});

// Create a new user
app.post('/create', async (req: Request, res: Response) => {
  try{
    const {email, password} = req.body;
    const user = await prisma.user.create({
      data: {
        email: email,
        password: password,
      },
    });
    console.log(user);
    res.json(user);
    else{
      res.send("Invalid input");
    }
  }catch(e){
    console.log("err");
  }
 
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
