import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';
import { ZodError } from 'zod';
import Credentials from 'next-auth/providers/credentials';
import { verifyPassword } from '@/lib/utils';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { users, type User } from '@/server/db/schema';
import { loginSchema } from '@/lib/zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          const { username, password } = loginSchema.parse(credentials);

          if (!username || !password) {
            return null;
          }

          const user: User = (
            await db.select().from(users).where(eq(users.username, username))
          )[0];

          if (!user) {
            return null;
          }

          const isValid = await verifyPassword(password, user.password);

          if (!isValid) {
            return null;
          }

          return user;
        } catch (error) {
          console.error(error);
          if (error instanceof ZodError) {
            return null;
          }

          return null;
        }
      },
    }),
  ],
});
