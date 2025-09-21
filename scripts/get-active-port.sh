#!/bin/bash

# Get the active development server port
# This script detects which port the Next.js dev server is running on

# Check common ports
for port in 3000 3005 3006 3007 3008; do
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/forms 2>/dev/null)
    if [ "$response" = "200" ] || [ "$response" = "307" ] || [ "$response" = "302" ]; then
        echo $port
        exit 0
    fi
done

# If no port found, default to 3000
echo "3000"
exit 1
