# Phase 8 Quick Reference

## Seed Database Command
```bash
npm run seed
```

## Demo Account Credentials
| Role | Email | Password |
|------|-------|----------|
| Guild Master | master@demo.nexora.com | demo123 |
| Active Hunter | hunter@demo.nexora.com | demo123 |
| New User | newuser@demo.nexora.com | demo123 |
| Client | client@demo.nexora.com | demo123 |
| Disputed User | disputed@demo.nexora.com | demo123 |

## Generated Data Summary
- **50 Users**: 5 demo accounts + 45 random users
- **10 Guilds**: With 5-20 members each
- **100 Bounties**: Various statuses and categories
- **~300 Messages**: Guild chat and DM conversations
- **~400 Transactions**: Rewards, deposits, withdrawals
- **~500 Activities**: Trust and credit history

## Key Features
- ✅ Realistic data patterns with weighted distributions
- ✅ Proper foreign key relationships
- ✅ Repeatable execution (clears old data first)
- ✅ Fast performance (~5-10 seconds)
- ✅ Console progress tracking

## File Locations
- **Generators**: `scripts/seed/generators.ts`
- **Main Script**: `scripts/seed-database.ts`
- **Demo Guide**: `docs/demo-flow.md`
- **Completion Doc**: `docs/phase8-complete.md`

## Common Tasks

### Clear and Reseed Database
```bash
npm run seed
```

### Login with Demo Account
1. Start the dev server: `npm run dev`
2. Navigate to login page
3. Use any demo account credentials above
4. Password for all: `demo123`

### View Generated Data
Use MongoDB Compass or CLI:
```bash
mongosh
use nexora
db.users.find().limit(5)
db.guilds.find()
db.bounties.find().limit(10)
```

## Status: Phase 8 Complete ✅
All demo data generation features implemented and tested successfully.
