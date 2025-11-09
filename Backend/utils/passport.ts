import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User";
import { IUser } from "../models/User";
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
      _accessToken: string,
      _refreshToken: string,
      _params: any,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email provided"));

        let user = (await User.findOne({ email })) as IUser | null;

        if (!user) {
          const pass = Math.floor(Math.random() * 90000000 + 10000000).toString();
          const hashed = await bcrypt.hash(pass, 10);

          user = (new User({
            name: profile.displayName,
            email,
            password: hashed,
          }) as unknown) as IUser;

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = (await User.findById(id)) as IUser | null;
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
