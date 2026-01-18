import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/validations/auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          await connectDB();
          const user = await User.findOne({ email }).select('+password');

          if (!user) {
            throw new Error('Invalid credentials');
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid credentials');
          }

          // Update last active
          user.lastActive = new Date();
          await user.save();

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            rank: user.rank,
            trustScore: user.trustScore,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.avatar = user.avatar;
        token.rank = user.rank;
        token.trustScore = user.trustScore;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as string;
        session.user.rank = token.rank as string;
        session.user.trustScore = token.trustScore as number;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
