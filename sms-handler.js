/**
 * THE SPY-MASTER GENERAL IS COMING TO DINNER
 * Twilio Serverless Function (Cloudflare D1 edition)
 * Deploy path: /sms-handler
 *
 * Env vars:
 *   CF_ACCOUNT_ID       015a7f30b04972a90412997fa9d11055
 *   CF_API_TOKEN        your Cloudflare API token (D1:edit)
 *   CF_D1_DATABASE_ID   d11752d7-ca84-45d3-9ba4-9828118c1553
 *   GITHUB_PAGES_URL    https://imbrettjackson.github.io/spymaster
 */

async function d1Query(sql, params=[]) {
  const url=`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/d1/database/${process.env.CF_D1_DATABASE_ID}/query`;
  const res=await fetch(url,{method:'POST',headers:{'Authorization':`Bearer ${process.env.CF_API_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({sql,params})});
  const data=await res.json();
  if(!data.success)throw new Error(JSON.stringify(data.errors));
  return data.result[0];
}
async function getSession(phone){const r=await d1Query('SELECT * FROM sessions WHERE phone=? LIMIT 1',[phone]);return r.results[0]||null;}
async function createSession(phone){const now=new Date().toISOString();await d1Query('INSERT INTO sessions (phone,beat,path,wrong_code_attempts,completed,ending,created_at,last_message_at) VALUES (?,?,?,?,?,?,?,?)',[phone,'START','default',0,0,'',now,now]);return getSession(phone);}
async function updateSession(phone,fields){const now=new Date().toISOString();const sets=Object.keys(fields).map(k=>`${k}=?`).join(',');const vals=[...Object.values(fields),now,phone];await d1Query(`UPDATE sessions SET ${sets},last_message_at=? WHERE phone=?`,vals);}

const PAGES=process.env.GITHUB_PAGES_URL||'https://imbrettjackson.github.io/spymaster';

function buildMessage(beat){
  switch(beat){
    case'START':return{body:`An unknown number. How refreshing.\nI was told to expect someone. Are you the one they sent?\n\nReply:\n1 - Yes, that's me\n2 - Wrong number\n3 - Who is this?`};
    case'WRONG_NUMBER':return{body:`A pity. I had such high hopes for this evening.\n\nIf you change your mind, you know where to find me.`};
    case'WHO_IS_THIS':return{body:`Ha. Good instinct, asking first.\n\nI am the Spymaster General. I'm coming to dinner.\nAnd you -- apparently -- are hosting.\n\nAre you the one they sent?\n\nReply:\n1 - Yes, that's me\n2 - I... think so?`};
    case'CONFIRM_IDENTITY_UNCERTAIN':return{body:`You think so.\n\nSplendid. The Agency's vetting process continues to impress.\n\nNo matter. Tonight's dinner depends on you.`};
    case'CONFIRM_IDENTITY':return{body:`Good. Don't say my name aloud. Don't type it either -- not yet.\n\nI'm arriving at your location at 7 PM sharp.\nThe problem: someone is already there.`};
    case'MISSION_BRIEF':return{body:`The person inside goes by BLACKBIRD. They believe this is a routine dinner. It is not.\n\nYour task: confirm their identity before I arrive.\n\n📍 https://maps.google.com/?q=34.0522,-118.2437\n\nText when in position:\n1 - In position\n2 - Need more information\n3 - What does Blackbird look like?`,mediaUrl:`${PAGES}/images/mission_map.jpg`};
    case'MORE_INFO':return{body:`You want more information. Naturally.\n\nThe dinner was arranged three weeks ago by a mutual contact who has since -- how to put this -- become unavailable.\n\nBlackbird doesn't know that yet.\n\nText READY when you want to proceed.`};
    case'BLACKBIRD_DESCRIPTION':return{body:`Observant. I like that.\n\nBlackbird will be at the bar.\nOrdering something with exactly two ice cubes.\nReading a physical newspaper in the year of our lord.\n\nYou'll know them.\n\nText READY when you want to proceed.`};
    case'IN_POSITION':return{body:`Good. Before you approach, you need the recognition phrase.\n\nI've encrypted it. Decode it here:\n🔐 ${PAGES}/cipher.html\n\nText me the decoded word when you have it.`};
    case'WRONG_CODE':return{body:`That's not it. Try the cipher again.\n\n🔐 ${PAGES}/cipher.html\n\nText me the decoded word.`};
    case'CORRECT_CODE':return{body:`EGRET. Correct.\n\nThe recognition phrase is: I heard the kitchen is closed.\nBlackbird will respond: It opens again at midnight.\n\nIf they don't say exactly that -- walk away.\n\nHow do you want to approach?\n\nReply:\n1 - Directly. Sit down next to them.\n2 - Casually. Order a drink first.\n3 - I need a moment.`};
    case'APPROACH_STALL':return{body:`Take your moment.\n\nThe clock doesn't care, but I do -- I arrive in 40 minutes.\n\nText READY when you're set.`};
    case'APPROACH_DIRECT':return{body:`Bold choice.\n\nYou walk up. You sit. You say the phrase.\n\nBlackbird looks at you for a long moment. Then:\n\nIt opens again at midnight.\n\nWhat do you do?\n\nReply:\n1 - Ask about the package\n2 - Ask about the Spymaster\n3 - Say nothing. Wait.`};
    case'APPROACH_CASUAL':return{body:`Measured. Good.\n\nWhile you're at the bar -- a word of caution:\n🎙️ ${PAGES}/audio/spymaster_warning.mp3\n\nThen: you approach. You sit. You say the phrase.\nBlackbird says: It opens again at midnight.\n\nWhat do you do?\n\nReply:\n1 - Ask about the package\n2 - Ask about the Spymaster\n3 - Say nothing. Wait.`};
    case'ASK_PACKAGE':return{body:`Blackbird slides a small envelope across the bar. Doesn't look at you.\n\nIt was never about the package. It was about who ordered it.\n\nA pause.\n\nDo you know who you're really working for?\n\nReply:\n1 - Yes. The Agency.\n2 - I'm beginning to wonder.\n3 - Tell me.`};
    case'ASK_SPYMASTER':return{body:`Blackbird's expression doesn't change.\n\nThe Spymaster General has been coming to dinner for thirty years. Always a different city. Always a different host. And the host never remembers the morning after.\n\nThey stand up. Tonight might be different. Depends on you.\n\nReply:\n1 - Why are you telling me this?\n2 - I won't let that happen.\n3 - What do I do?`};
    case'WAIT_SILENCE':return{body:`Smart.\n\nThe silence stretches. Blackbird relaxes -- almost imperceptibly.\n\nYou're different from the others, they say finally.\n\nThey slide something across the bar. Not the envelope. A key.\n\nRoom 412. Everything you need is there. Go before the Spymaster arrives.\n\nReply:\n1 - Take the key and go\n2 - Ask what's in the room\n3 - Stay and wait for the Spymaster`};
    case'ENDING_AGENCY':return{body:`Blackbird nods once. Then you're exactly what they wanted you to be.\n\nAt 7 PM, the Spymaster General smiles. Dinner was delicious. I'll see you again next year.\n\nYou don't remember what was served.\n\n🏁 OFFICIAL ENDING\n${PAGES}/debrief.html`};
    case'ENDING_DOUBT':return{body:`Something shifts. The Spymaster arrives. You're there -- but changed.\n\nNext time, bring someone who doesn't ask questions.\n\nThere is no next time.\n\n🏁 THE DOUBT ENDING\n${PAGES}/debrief.html`};
    case'ENDING_TELL_ME':return{body:`Blackbird tells you everything. Six minutes.\n\nBy the time you look up, they're gone. The bar stool is cold.\n\nDinner is... illuminating.\n\n🏁 THE INFORMED ENDING\n${PAGES}/debrief.html`};
    case'ENDING_RESIST':return{body:`When the Spymaster arrives, you're ready. The dinner never takes place.\n\nBlackbird sends a postcard: Good. Nothing else.\n\n🏁 THE RESISTANCE ENDING\n${PAGES}/debrief.html`};
    case'ENDING_KEY':return{body:`Room 412. You find what Blackbird left. You understand everything.\n\nYou're gone before the Spymaster's car arrives.\n\nSomewhere, a phone rings in an empty hotel room. Nobody answers.\n\n🏁 THE ESCAPE ENDING\n${PAGES}/debrief.html`};
    case'ENDING_WAIT_SPYMASTER':return{body:`The Spymaster General sits down across from you. Orders something with two ice cubes. Picks up a newspaper. Looks over the top of it.\n\nYou're still here. Nobody stays.\n\n...I stayed.\n\nThen you're the new Blackbird.\n\n🏁 THE FULL CIRCLE ENDING\n${PAGES}/debrief.html`};
    default:return{body:`...I wasn't expecting that.\n\nReply 1, 2, or 3 -- or text START to begin again.`};
  }
}

function transition(beat,input,path){
  const i=input.trim().toUpperCase();
  const n=i.replace(/\D/g,'');
  switch(beat){
    case'START':if(n==='1')return{nextBeat:'CONFIRM_IDENTITY',nextPath:'confirmed'};if(n==='2')return{nextBeat:'WRONG_NUMBER',nextPath:'abort'};if(n==='3')return{nextBeat:'WHO_IS_THIS',nextPath:'cautious'};return{nextBeat:'START',nextPath:path};
    case'WRONG_NUMBER':return{nextBeat:'START',nextPath:'default'};
    case'WHO_IS_THIS':if(n==='1')return{nextBeat:'CONFIRM_IDENTITY',nextPath:'cautious_confirmed'};if(n==='2')return{nextBeat:'CONFIRM_IDENTITY_UNCERTAIN',nextPath:'uncertain'};return{nextBeat:'WHO_IS_THIS',nextPath:path};
    case'CONFIRM_IDENTITY_UNCERTAIN':case'CONFIRM_IDENTITY':return{nextBeat:'MISSION_BRIEF',nextPath:path};
    case'MISSION_BRIEF':if(n==='1')return{nextBeat:'IN_POSITION',nextPath:path};if(n==='2')return{nextBeat:'MORE_INFO',nextPath:path};if(n==='3')return{nextBeat:'BLACKBIRD_DESCRIPTION',nextPath:path};return{nextBeat:'MISSION_BRIEF',nextPath:path};
    case'MORE_INFO':case'BLACKBIRD_DESCRIPTION':if(i==='READY'||n==='1')return{nextBeat:'IN_POSITION',nextPath:path};return{nextBeat:beat,nextPath:path};
    case'IN_POSITION':if(i==='EGRET')return{nextBeat:'CORRECT_CODE',nextPath:path};return{nextBeat:'WRONG_CODE',nextPath:path};
    case'WRONG_CODE':if(i==='EGRET')return{nextBeat:'CORRECT_CODE',nextPath:path};return{nextBeat:'WRONG_CODE',nextPath:path};
    case'CORRECT_CODE':if(n==='1')return{nextBeat:'APPROACH_DIRECT',nextPath:'direct'};if(n==='2')return{nextBeat:'APPROACH_CASUAL',nextPath:'casual'};if(n==='3')return{nextBeat:'APPROACH_STALL',nextPath:path};return{nextBeat:'CORRECT_CODE',nextPath:path};
    case'APPROACH_STALL':if(i==='READY'||n==='1')return{nextBeat:'CORRECT_CODE',nextPath:path};return{nextBeat:'APPROACH_STALL',nextPath:path};
    case'APPROACH_DIRECT':case'APPROACH_CASUAL':if(n==='1')return{nextBeat:'ASK_PACKAGE',nextPath:path};if(n==='2')return{nextBeat:'ASK_SPYMASTER',nextPath:path};if(n==='3')return{nextBeat:'WAIT_SILENCE',nextPath:path};return{nextBeat:beat,nextPath:path};
    case'ASK_PACKAGE':if(n==='1')return{nextBeat:'ENDING_AGENCY',nextPath:'official'};if(n==='2')return{nextBeat:'ENDING_DOUBT',nextPath:'doubt'};if(n==='3')return{nextBeat:'ENDING_TELL_ME',nextPath:'informed'};return{nextBeat:beat,nextPath:path};
    case'ASK_SPYMASTER':if(n==='1')return{nextBeat:'ENDING_DOUBT',nextPath:'doubt'};if(n==='2')return{nextBeat:'ENDING_RESIST',nextPath:'resist'};if(n==='3')return{nextBeat:'ENDING_TELL_ME',nextPath:'informed'};return{nextBeat:beat,nextPath:path};
    case'WAIT_SILENCE':if(n==='1')return{nextBeat:'ENDING_KEY',nextPath:'escape'};if(n==='2')return{nextBeat:'ENDING_TELL_ME',nextPath:'informed'};if(n==='3')return{nextBeat:'ENDING_WAIT_SPYMASTER',nextPath:'full_circle'};return{nextBeat:beat,nextPath:path};
    default:return{nextBeat:'START',nextPath:'default'};
  }
}

exports.handler=async function(context,event,callback){
  const twiml=new Twilio.twiml.MessagingResponse();
  const phone=event.From;
  const body=(event.Body||'').trim();
  if(['STOP','UNSUBSCRIBE','CANCEL','QUIT','END'].includes(body.toUpperCase()))return callback(null,twiml);
  try{
    let session=await getSession(phone)||await createSession(phone);
    const{nextBeat,nextPath}=transition(session.beat||'START',body,session.path||'default');
    const msg=buildMessage(nextBeat);
    const r=twiml.message(msg.body);
    if(msg.mediaUrl)r.media(msg.mediaUrl);
    const isEnding=nextBeat.startsWith('ENDING_');
    await updateSession(phone,{beat:nextBeat,path:nextPath,completed:isEnding?1:0,ending:isEnding?nextBeat.replace('ENDING_','').toLowerCase():(session.ending||''),wrong_code_attempts:nextBeat==='WRONG_CODE'?(session.wrong_code_attempts||0)+1:(session.wrong_code_attempts||0)});
  }catch(err){console.error(err);twiml.message('The line went quiet. Text anything to reconnect.');}
  return callback(null,twiml);
};
