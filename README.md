# The Spy-Master General is Coming to Dinner

SMS-based narrative game. One character. One number. Six endings.

## Stack
- **SMS**: Twilio (serverless function)
- **Database**: Cloudflare D1 (`spymaster-sessions`, ID: `d11752d7-ca84-45d3-9ba4-9828118c1553`)
- **Frontend**: GitHub Pages (this repo)
- **Script**: Twine `.twee` format

## Files
| File | Purpose |
|------|---------|
| `cipher.html` | Interactive Caesar cipher puzzle (GitHub Pages) |
| `debrief.html` | End-of-game page (GitHub Pages) |
| `dashboard.html` | Mobile operator dashboard (open locally) |
| `sms-handler.js` | Paste into Twilio Functions |
| `spy-master-general.twee` | Import into Twine 2 to edit narrative |

## Setup
Twilio env vars needed:
```
CF_ACCOUNT_ID       015a7f30b04972a90412997fa9d11055
CF_API_TOKEN        [your cloudflare API token — D1:edit scope]
CF_D1_DATABASE_ID   d11752d7-ca84-45d3-9ba4-9828118c1553
GITHUB_PAGES_URL    https://imbrettjackson.github.io/spymaster
```

## Cipher answer
Encoded: `X Z K X M` | Shift: **7** | Answer: **EGRET**
