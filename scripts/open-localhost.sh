#!/bin/bash

# Open localhost URL with dynamic port detection
# Usage: ./open-localhost.sh /forms

# Get the active port
ACTIVE_PORT=$(./scripts/get-active-port.sh)

# Construct the URL
if [ -z "$1" ]; then
    URL="http://localhost:$ACTIVE_PORT"
else
    URL="http://localhost:$ACTIVE_PORT$1"
fi

echo "Opening: $URL"
open "$URL"
