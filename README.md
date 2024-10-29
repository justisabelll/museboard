# museboard

simple place for me to keep things that inspire me

## requirements

- bun
- docker (or turso account)
- github account
- uploadthing account

## setup

1. create your .env file based on the .env.example file:

```bash
# database (choose either local docker or turso)
DATABASE_URL="http://127.0.0.1:8080"  # for local docker
DATABASE_AUTH_TOKEN=""                 # only needed for turso

# github auth
AUTH_GITHUB_ID=""          # from github oauth app
AUTH_GITHUB_SECRET=""      # from github oauth app
ADMIN_EMAIL=""            # your github email

# uploadthing
UPLOADTHING_TOKEN=""      # from uploadthing dashboard

# next auth
AUTH_SECRET=""           # generate with: openssl rand -base64 32 or npx auth secret https://authjs.dev/reference/core/errors#missingsecret
NEXTAUTH_URL="http://localhost:3000"
```

2. start the database (if using docker):

```bash
docker run -d -p 8080:8080 ghcr.io/libsql/sqld:latest
```

3. install dependencies:

```bash
bun install
```

4. setup database:

```bash
bun db:push  # create tables
bun db:seed  # add sample data
```

5. run the app:

```bash
bun dev
```

## database commands

```bash
bun db:push    # push schema changes
bun db:seed    # add sample data
bun db:studio  # open drizzle studio
```

## development

the app uses:

- next.js 14 app router
- drizzle orm with libsql (local docker or turso)
- uploadthing for image uploads
- next-auth with github provider
- tailwind for styling
- shadcn/ui components

authentication is restricted to a single github account specified by ADMIN_EMAIL in .env so if you deploy only you will be able to add new items even though the app is public
