import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Dummy user data
const users = [
  { id: "1", username: "test", password: "password123" }, // Plaintext password
];

// Passport configuration
passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.username === username);
    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    if (password === user.password) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect password" });
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  const user = users.find((u) => u.id === id);
  if (user) return done(null, user);
  done(null, false);
});

export default passport;
