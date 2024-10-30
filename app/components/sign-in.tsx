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
            size="sm"
            className="text-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-300 uppercase tracking-widest text-xs py-1.5 sm:py-3 px-3 sm:px-6"
          >
            Sign Out
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
            className="bg-background text-foreground border-2 border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-300 uppercase tracking-widest text-xs py-1.5 sm:py-3 px-2 sm:px-4 flex items-center"
          >
            Admin Sign In
          </Button>
        </Form>
      )}
    </div>
  );
}
