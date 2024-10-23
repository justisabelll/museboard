//import { useState } from 'react';
import { signIn } from '@/server/auth';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { LogIn } from 'lucide-react';

export default function SignIn() {
  //   const [open, setOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-primary/10 text-primary"
        >
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center text-foreground">
            Sign In
            <Button
              variant="ghost"
              size="icon"
              //   onClick={() => setOpen(false)}
              className="p-0 w-8 h-8 text-foreground"
            />
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your credentials to access your account.
          </DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            'use server';
            await signIn('credentials', formData);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              required
              className="bg-input text-input-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="bg-input text-input-foreground"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground"
            >
              <LogIn className="mr-2 w-4 h-4" />
              Sign In
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
