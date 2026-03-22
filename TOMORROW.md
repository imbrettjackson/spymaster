# Spy-Master General — Resume Here

## What's Done ✅

| Component | Status |
|-----------|--------|
| GitHub repo | ✅ live — github.com/imbrettjackson/spymaster |
| Cloudflare D1 database | ✅ live — spymaster-sessions, sessions table ready |
| Twilio function | ✅ deployed — spymaster-9418.twil.io/sms-handler |
| Twilio env vars | ✅ all 4 set |
| Twilio phone number | ✅ +1 (775) 278-9325, wired to function |
| Twilio account | ✅ funded ($13 balance) |
| Game script | ✅ spy-master-general.twee |
| Cipher puzzle page | ✅ cipher.html (answer: EGRET, shift 7) |
| Operator dashboard | ✅ dashboard.html (open locally on phone) |
| A2P Brand registration | ✅ REGISTERED (Mar 21 2026) |
| A2P Campaign registration | ✅ SUBMITTED — under review (expect 24-72 hrs, possibly longer) |

---

## Remaining Tasks (in order)

### 1 — Wait for A2P Campaign Approval
You'll get an email from Twilio when the campaign clears.
Check status any time: https://console.twilio.com/us1/develop/regulatory-compliance/bundles
Once approved, proceed to step 2.

### 2 — Link Phone Number to Messaging Service (5 min, after approval)
When campaign is approved, Twilio creates a Messaging Service automatically.
Go to: https://console.twilio.com/us1/develop/messaging/services
- Open the new Messaging Service (linked to your campaign)
- Add +17752789325 to the service under "Sender Pool"
Then update your phone number config to use this Messaging Service:
https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
- Click +17752789325 > Messaging Configuration
- Messaging Service > select the new service > Save

### 3 — Enable GitHub Pages (2 min)
https://github.com/imbrettjackson/spymaster/settings/pages
Source: Deploy from branch > main > / (root) > Save
Cipher page live at: https://imbrettjackson.github.io/spymaster/cipher.html

### 4 — Rotate Cloudflare API Token ⚠️ SECURITY
https://dash.cloudflare.com/profile/api-tokens
- Delete the token shared in chat on Mar 21
- Create replacement: Custom Token > D1:Edit > your account
- Update CF_API_TOKEN in: https://console.twilio.com/us1/develop/functions/services
- Redeploy the function after updating

### 5 — Add Two Placeholder Assets (10 min)
Upload to https://github.com/imbrettjackson/spymaster:
- images/mission_map.jpg — overhead map screenshot, label YOU + BLACKBIRD
- audio/spymaster_warning.mp3 — 15 sec recording. Script: "Measured approach. But don't dawdle — Blackbird is paranoid on a good day. You have one drink's worth of time. Make it count."

### 6 — Test
Text anything to +1 (775) 278-9325 from +1 (323) 929-7425.
Expected reply: "An unknown number. How refreshing. I was told to expect someone. Are you the one they sent?"

---

## Credentials
All credentials are in the Twilio and Cloudflare dashboards — not stored here for security.
Cipher answer: EGRET (shift 7, encoded word XZKXM)

---

## Optional Upgrades
- [ ] Real Spymaster voice recording for audio beat
- [ ] Real annotated map image for mission brief MMS
- [ ] Expand Twine script with more branches
- [ ] Enable Twilio auto-recharge to prevent future suspension
- [ ] Build out debrief.html end-of-game page
