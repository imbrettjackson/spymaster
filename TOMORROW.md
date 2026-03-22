# Spy-Master General — Resume Here Tomorrow

## What's Already Done ✅

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

---

## The One Blocker 🚧

**A2P 10DLC registration.** US carriers require local numbers to be registered before delivering SMS. The Twilio function fires correctly (Cloudflare D1 confirms sessions are created on every inbound text) — but outbound replies are silently blocked at the carrier level. This is NOT a code problem.

---

## Tomorrow's Tasks (in order)

### 1 — Enable GitHub Pages (2 min)
https://github.com/imbrettjackson/spymaster/settings/pages
Source: Deploy from branch > main > / (root) > Save
Cipher page will be live at: https://imbrettjackson.github.io/spymaster/cipher.html

### 2 — A2P 10DLC Registration (15 min setup, 1-5 days for approval)
https://console.twilio.com/us1/develop/regulatory-compliance/bundles
- Business: Live Action Attractions LLC
- Website: liveactionattractions.com
- Use case description: "Interactive entertainment game. Players opt in and text a number to receive a branching narrative SMS experience. Low volume, single number, 10-50 messages per session."
- Once approved: messages deliver with zero other changes needed.

### 3 — Rotate Cloudflare API Token (5 min) ⚠️ SECURITY
https://dash.cloudflare.com/profile/api-tokens
- Delete the token that was shared in chat tonight
- Create replacement: Custom Token > D1:Edit > your account
- Update CF_API_TOKEN in Twilio function env vars, then redeploy
https://console.twilio.com/us1/develop/functions/services

### 4 — Add Two Placeholder Assets (10 min)
Upload to https://github.com/imbrettjackson/spymaster:
- images/mission_map.jpg — any overhead map screenshot with YOU + BLACKBIRD labels
- audio/spymaster_warning.mp3 — 15 sec. Script: "Measured approach. But don't dawdle — Blackbird is paranoid on a good day. You have one drink's worth of time. Make it count."

### 5 — Test Once A2P Clears
Text anything to +1 (775) 278-9325 from your personal number.
Expected: "An unknown number. How refreshing. I was told to expect someone..."

---

## Credentials
All credentials are in the Twilio console and Cloudflare dashboard — not stored here for security.
Cipher answer: EGRET (shift 7 on encoded word XZKXM)

---

## Optional Future Upgrades
- [ ] Real Spymaster voice recording for the audio beat
- [ ] Annotated map image for mission brief MMS
- [ ] Expand Twine script with more branches
- [ ] Twilio auto-recharge to prevent future suspension
- [ ] Build out debrief.html end-of-game page
