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
            className="text-black border-black hover:bg-black hover:text-white transition-colors duration-300 uppercase tracking-widest text-xs py-3 px-6"
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
            className="bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 uppercase tracking-widest text-xs py-3 px-2 flex items-center"
          >
            Admin Sign In
          </Button>
        </Form>
      )}
    </div>
  );
}
