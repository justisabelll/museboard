import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';

const ALLOWED_USER = process.env.ADMIN_EMAIL;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  adapter: DrizzleAdapter(db),
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== 'github') {
        return false;
      }

      if (!profile?.email) {
        console.error('No email found in GitHub profile');
        return false;
      }
      return profile.email === ALLOWED_USER;
    },
  },
});
