#!/bin/bash

# Database Backup Script
# Creates timestamped backups of the database tied to commit IDs

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="db-backups"
DB_PATH="prisma/db/prod.db"
PRISMA_DIR="prisma"

# Get current commit info
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_SHORT=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory structure
COMMIT_DIR="${BACKUP_DIR}/${COMMIT_SHORT}_${TIMESTAMP}"
mkdir -p "$COMMIT_DIR"

echo -e "${BLUE}📦 Creating database backup...${NC}"
echo -e "Commit: ${YELLOW}${COMMIT_SHORT}${NC} (${COMMIT_HASH})"
echo -e "Message: ${YELLOW}${COMMIT_MESSAGE}${NC}"
echo -e "Backup to: ${GREEN}${COMMIT_DIR}${NC}"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}❌ Database not found at ${DB_PATH}${NC}"
    exit 1
fi

# Copy database file
cp "$DB_PATH" "$COMMIT_DIR/prod.db"

# Copy Prisma schema and migrations for context
cp "$PRISMA_DIR/schema.prisma" "$COMMIT_DIR/"
cp -r "$PRISMA_DIR/migrations" "$COMMIT_DIR/"

# Create metadata file
cat > "$COMMIT_DIR/backup-info.json" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "commit": {
    "hash": "$COMMIT_HASH",
    "short": "$COMMIT_SHORT",
    "message": "$COMMIT_MESSAGE"
  },
  "database": {
    "path": "$DB_PATH",
    "size_bytes": $(stat -f%z "$DB_PATH"),
    "size_human": "$(ls -lh "$DB_PATH" | awk '{print $5}')"
  },
  "forms_count": $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Form WHERE deleted_at IS NULL;" 2>/dev/null || echo "0"),
  "responses_count": $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM FormResponse WHERE deleted_at IS NULL;" 2>/dev/null || echo "0"),
  "users_count": $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM User WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")
}
EOF

# Create README for the backup
cat > "$COMMIT_DIR/README.md" << EOF
# Database Backup

**Commit:** \`${COMMIT_SHORT}\`  
**Message:** ${COMMIT_MESSAGE}  
**Date:** $(date)  
**Database Size:** $(ls -lh "$DB_PATH" | awk '{print $5}')

## Contents
- \`prod.db\` - SQLite database file
- \`schema.prisma\` - Prisma schema at time of backup
- \`migrations/\` - All migration files
- \`backup-info.json\` - Backup metadata

## Restore Instructions
\`\`\`bash
# Stop your development server first
cp ${COMMIT_DIR}/prod.db prisma/db/prod.db
npx prisma generate
\`\`\`

## Database Stats
- Forms: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Form WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")
- Responses: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM FormResponse WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")
- Users: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM User WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")
EOF

echo -e "${GREEN}✅ Backup created successfully!${NC}"
echo -e "Location: ${GREEN}${COMMIT_DIR}${NC}"
echo -e "Database stats:"
echo -e "  📝 Forms: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Form WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")"
echo -e "  📊 Responses: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM FormResponse WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")"
echo -e "  👥 Users: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM User WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")"
