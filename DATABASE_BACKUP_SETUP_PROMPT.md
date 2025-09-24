# Database Backup System Setup Prompt

## Overview
Please set up an automated database backup system for this project that creates commit-tied database snapshots. This system will automatically backup the database before each git commit and provide easy restore capabilities.

## Requirements

### 1. Create Backup Directory Structure
```bash
mkdir -p db-backups
```

### 2. Create Backup Script (`scripts/backup-db.sh`)
Create an executable script that:
- Gets current commit hash and message
- Creates timestamped backup directory: `{commit_short}_{timestamp}`
- Copies database file, Prisma schema, and migrations
- Generates metadata JSON with commit info and database stats
- Creates a README with restore instructions
- Shows colored output with database statistics

### 3. Create Restore Script (`scripts/restore-db.sh`)
Create an executable script that:
- Takes backup directory as argument
- Shows backup information from metadata
- Creates backup of current database before restore
- Asks for confirmation before proceeding
- Copies database and regenerates Prisma client
- Shows database statistics after restore

### 4. Update Pre-commit Hook
Modify the existing `scripts/hooks/pre-commit` to:
- Call the backup script before commit checks
- Keep existing database file prevention logic
- Ensure backups are created automatically

### 5. Update .gitignore
Add `db-backups/` to .gitignore to keep backups local

### 6. Add NPM Scripts
Add these scripts to package.json:
- `"db:backup": "./scripts/backup-db.sh"`
- `"db:restore": "./scripts/restore-db.sh"`
- `"db:list-backups": "ls -la db-backups/"`

## Expected Backup Structure
```
db-backups/
└── {commit_short}_{timestamp}/
    ├── prod.db                    # Database file
    ├── schema.prisma              # Prisma schema
    ├── migrations/                # All migration files
    ├── backup-info.json           # Metadata
    └── README.md                  # Restore instructions
```

## Key Features
- **Automatic**: Pre-commit hook creates backups before every commit
- **Commit-tied**: Backup folders named with commit hash and timestamp
- **Complete**: Includes database, schema, migrations, and metadata
- **Safe**: Creates backups of current database before restore
- **Easy**: Simple npm commands for backup/restore operations
- **Local**: Backups stay local, never committed to git

## Database Detection
The scripts should automatically detect:
- Database path (likely `prisma/db/prod.db` or similar)
- Prisma schema location
- Migration directory
- Count forms, responses, and users in database

## Colors and Output
Use colored terminal output:
- Blue for information
- Green for success
- Yellow for warnings
- Red for errors

## Testing
After setup:
1. Test manual backup: `npm run db:backup`
2. Test restore: `npm run db:restore db-backups/{folder}`
3. Test pre-commit hook with a test commit
4. Verify backups are created automatically

## Files to Create/Modify
1. `scripts/backup-db.sh` (new, executable)
2. `scripts/restore-db.sh` (new, executable)
3. `scripts/hooks/pre-commit` (modify existing)
4. `.gitignore` (add db-backups/)
5. `package.json` (add npm scripts)

## Important Notes
- Make all scripts executable with `chmod +x`
- Ensure database path detection works for this project
- Test with actual database to verify form/response counting
- Keep existing pre-commit functionality intact
- Use proper error handling and user confirmations

Please implement this complete backup system following these specifications.
