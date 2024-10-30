import { signIn, auth, signOut } from '@/server/auth';
import { Button } from '@/app/components/ui/button';
import Form from 'next/form';

export default async function SignIn() {
  const session = await auth();

  return (
    <div className="font-sans">
      {session ? (
        <Form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <Button
            variant="outline"
            className="text-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-300 uppercase tracking-widest text-xs h-10 px-4"
          >
            <span>Sign Out</span>
          </Button>
        </Form>
      ) : (
        <Form
          action={async () => {
            'use server';
            await signIn('github');
          }}
        >
          <Button
            type="submit"
            className="bg-background text-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-300 uppercase tracking-widest text-xs h-10 px-4 flex items-center"
          >
            <span className="hidden sm:inline">Admin Sign In</span>
            <span className="sm:hidden">Admin</span>
          </Button>
        </Form>
      )}
    </div>
  );
}
