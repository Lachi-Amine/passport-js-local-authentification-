import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import session from 'express-session';
import passport from 'passport';


// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());



const prisma = new PrismaClient();

//session
app.use(session
  ({
    secret: 'secret',
    resave  : false,
    saveUninitialized: false,
    cookie: {maxAge: 86400000}
  }));

app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('Server is up and running!');
});

// Create a new user
app.post('/create', async (req: Request, res: Response) => {
  try{
    const {email, password} = req.body;
    if (!email || !password) {
      res.send("email or password is empty")
   }
    else{
      const check= await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if(check){
        res.send("user already exist");
      }
      else{
      const user = await prisma.user.create({
        data: {
          email: email,
          password: password,
        },
      });
      res.json(user);
    }
    res.send("user created");
      
    }
  }catch(e){
    //nothing
    console.log("err");
    //fix later
  }
 
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
