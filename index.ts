import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import passport from "./passport";

// Load environment variables
dotenv.config();

const app: Application = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 }, // 1 day
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/home", (req: Request, res: Response) => {
  res.send("Success! You are logged in.");
});

app.post("/login", (req: Request, res: Response) => {
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
  })(req, res);
});

app.post("/create", async( req:any,res:any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email or password is missing");
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while creating the user");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
