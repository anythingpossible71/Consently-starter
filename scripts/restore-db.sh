#!/bin/bash

# Database Restore Script
# Restores database from a backup directory

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backup directory is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}❌ Usage: $0 <backup-directory>${NC}"
    echo ""
    echo "Available backups:"
    ls -la db-backups/ 2>/dev/null | grep "^d" | awk '{print "  " $9}' | grep -v "^\.$\|^\.\.$" || echo "  No backups found"
    exit 1
fi

BACKUP_DIR="$1"
DB_PATH="prisma/db/prod.db"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}❌ Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# Check if database file exists in backup
if [ ! -f "$BACKUP_DIR/prod.db" ]; then
    echo -e "${RED}❌ Database file not found in backup: $BACKUP_DIR/prod.db${NC}"
    exit 1
fi

echo -e "${BLUE}🔄 Restoring database from backup...${NC}"
echo -e "Backup: ${YELLOW}$BACKUP_DIR${NC}"

# Show backup info if available
if [ -f "$BACKUP_DIR/backup-info.json" ]; then
    echo -e "${BLUE}📋 Backup Information:${NC}"
    COMMIT_SHORT=$(cat "$BACKUP_DIR/backup-info.json" | grep '"short"' | cut -d'"' -f4)
    COMMIT_MESSAGE=$(cat "$BACKUP_DIR/backup-info.json" | grep '"message"' | cut -d'"' -f4)
    FORMS_COUNT=$(cat "$BACKUP_DIR/backup-info.json" | grep '"forms_count"' | cut -d':' -f2 | tr -d ' ,')
    RESPONSES_COUNT=$(cat "$BACKUP_DIR/backup-info.json" | grep '"responses_count"' | cut -d':' -f2 | tr -d ' ,')
    USERS_COUNT=$(cat "$BACKUP_DIR/backup-info.json" | grep '"users_count"' | cut -d':' -f2 | tr -d ' ,')
    
    echo -e "  Commit: ${YELLOW}$COMMIT_SHORT${NC}"
    echo -e "  Message: ${YELLOW}$COMMIT_MESSAGE${NC}"
    echo -e "  Forms: ${GREEN}$FORMS_COUNT${NC}"
    echo -e "  Responses: ${GREEN}$RESPONSES_COUNT${NC}"
    echo -e "  Users: ${GREEN}$USERS_COUNT${NC}"
fi

# Create backup of current database
if [ -f "$DB_PATH" ]; then
    echo -e "${BLUE}💾 Creating backup of current database...${NC}"
    cp "$DB_PATH" "$DB_PATH.backup-$(date +%Y%m%d_%H%M%S)"
fi

# Stop any running development servers (optional)
echo -e "${YELLOW}⚠️  Make sure to stop your development server before proceeding${NC}"
read -p "Continue with restore? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Restore cancelled${NC}"
    exit 0
fi

# Copy database from backup
echo -e "${BLUE}📋 Copying database file...${NC}"
cp "$BACKUP_DIR/prod.db" "$DB_PATH"

# Regenerate Prisma client
echo -e "${BLUE}🔧 Regenerating Prisma client...${NC}"
npx prisma generate

echo -e "${GREEN}✅ Database restored successfully!${NC}"
echo -e "Restored from: ${GREEN}$BACKUP_DIR${NC}"
echo -e "Database: ${GREEN}$DB_PATH${NC}"

# Show current database stats
echo -e "${BLUE}📊 Current database stats:${NC}"
echo -e "  📝 Forms: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Form WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")"
echo -e "  📊 Responses: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM FormResponse WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")"
echo -e "  👥 Users: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM User WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")"

