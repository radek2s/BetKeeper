# Bet Keeper Database

Initialize development database:
```
npx prisma migrate dev
```
This create database if does not exists and performs all required migrations.

Generate Prisma Client code:
```
npx prisma generate
```
Creates TypeScript files required for client adapter.


Fill database with mock data:
```
npx tsx .\database\init\schema_e2e.seed.ts
```

Use specific `.env.*` file:
```
npx dotenv -e .env.e2e -- <YOUR_COMMAND>
```


### Maintenance

Using SQLite files just delete `*.db` file in `/data` directory.

When there is an issue with migration delete content of `/migrations` directory.