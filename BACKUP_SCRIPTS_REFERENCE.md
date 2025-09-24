# Database Backup Scripts Reference

## Quick Setup Commands

```bash
# Create directory
mkdir -p db-backups

# Make scripts executable
chmod +x scripts/backup-db.sh
chmod +x scripts/restore-db.sh
chmod +x scripts/hooks/pre-commit-db-backup
```

## Package.json Scripts to Add

```json
"db:backup": "./scripts/backup-db.sh",
"db:restore": "./scripts/restore-db.sh", 
"db:list-backups": "ls -la db-backups/"
```

## .gitignore Addition

```
# Database backups (automated by git hooks)
db-backups/
```

## Pre-commit Hook Addition

Add this to the top of `scripts/hooks/pre-commit`:

```bash
# Create database backup before commit
echo "🔒 Pre-commit: Creating database backup..."
./scripts/backup-db.sh
```

## Database Detection Logic

The scripts should detect:
- Database path: `prisma/db/prod.db` (or similar)
- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`

## Key Features to Implement

1. **Automatic Detection**: Find database file automatically
2. **Commit Info**: Get hash, short hash, commit message
3. **Timestamping**: Use format `YYYYMMDD_HHMMSS`
4. **Metadata**: JSON with commit info and DB stats
5. **Safety**: Backup current DB before restore
6. **Colors**: Use colored output for better UX
7. **Statistics**: Count forms, responses, users
8. **Confirmation**: Ask before destructive operations

## Testing Checklist

- [ ] Manual backup works: `npm run db:backup`
- [ ] Restore works: `npm run db:restore {folder}`
- [ ] Pre-commit hook creates backups
- [ ] Database stats are accurate
- [ ] Metadata JSON is valid
- [ ] README instructions are clear
- [ ] All scripts are executable
