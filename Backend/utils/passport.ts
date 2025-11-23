import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import prisma from "./prisma.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (
      _req: any,
      accessToken: string,
      refreshToken: string,
      _params: any,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email provided"));
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          const randomPassword = Math.floor(Math.random() * 90000000 + 10000000).toString();
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email,
              username: email.split("@")[0],
              password: hashedPassword,
              upiId: null,
              accessToken,
              refreshToken,
            },
          });
        } else {
          user = await prisma.user.update({
            where: { email },
            data: {
              accessToken,
              refreshToken,
            },
          });
        }
        return done(null, user);
      } catch (err) {
        console.error("Error in GoogleStrategy:", err);
        return done(err as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
