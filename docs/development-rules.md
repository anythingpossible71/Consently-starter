# Development Rules

## Port Management
- **Dynamic Port Detection**: Next.js automatically finds available ports when 3000 is busy
- **Never Hardcode Ports**: Always detect the actual active port before opening URLs
- **Use Scripts**: Use `./scripts/get-active-port.sh` and `./scripts/open-localhost.sh` for port detection
- **Test Before Opening**: Verify the port responds before opening URLs

## Scripts Available
- `scripts/get-active-port.sh` - Detects which port is active (3000, 3005, 3006, etc.)
- `scripts/open-localhost.sh /path` - Opens URLs with dynamic port detection

## Examples
```bash
# ❌ Wrong (hardcoded)
open http://localhost:3000/forms

# ✅ Correct (dynamic)
./scripts/open-localhost.sh /forms
```

## Last Updated
- Date: $(date)
- Reason: Next.js automatically manages ports, so hardcoding port 3000 is unreliable
