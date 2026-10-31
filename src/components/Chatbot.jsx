import React,{useEffect,useRef,useState} from 'react';
import {ArrowUpRight,MessageCircle,Send,X} from 'lucide-react';
import {brand,localReply} from '../content';
import {makeConversation} from '../chat-protocol';
const api=import.meta.env.VITE_CHAT_API_URL?.trim();
const welcome={role:'assistant',text:'Welcome to Noha & Hannah. Ask about our homeware, opening hours, delivery or visiting us in Leeds.'};
const suggestions=[['Opening hours','What are your opening hours?'],['Delivery','Can you arrange delivery?'],['Our range','What do you sell?']];
export default function Chat({open,setOpen}){
 const [messages,setMessages]=useState([welcome]),[input,setInput]=useState(''),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[consent,setConsent]=useState(false);
 const field=useRef(null),launcher=useRef(null),closer=useRef(null),log=useRef(null),consentField=useRef(null),abort=useRef(null),inFlight=useRef(false);
 useEffect(()=>{if(open)closer.current?.focus()},[open]);
 useEffect(()=>{if(log.current)log.current.scrollTop=log.current.scrollHeight},[messages,open,busy]);
 useEffect(()=>()=>abort.current?.abort(),[]);
 function close(){setOpen(false);launcher.current?.focus()}
 function clear(){if(inFlight.current)return;setMessages([welcome]);setInput('');setStatus('');field.current?.focus()}
 async function send(event){
  event.preventDefault();const text=input.trim();if(!text||inFlight.current)return;
  if(text.length>2000){setStatus('Please keep your question under 2,000 characters.');return}
  if(api&&!consent){setStatus('Please agree to send your conversation to Google Gemini before chatting.');consentField.current?.focus();return}
  const completed=messages,conversation=makeConversation(completed,text);
  inFlight.current=true;setBusy(true);setStatus('Thinking…');setInput('');setMessages([...completed,{role:'user',text}]);
  const controller=new AbortController();abort.current=controller;let timedOut=false;const timer=setTimeout(()=>{timedOut=true;controller.abort()},28000);
  try{
   let reply;
   if(api){
    const response=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:conversation}),signal:controller.signal});
    const data=await response.json().catch(()=>{throw new Error('The chatbot returned an unexpected response. Please try again or contact the store.')});
    if(!response.ok)throw new Error(typeof data?.error==='string'?data.error:'The assistant is unavailable. Please try again.');
    if(typeof data?.reply!=='string'||!data.reply.trim())throw new Error('No answer was received. Please try again.');
    reply=data.reply.trim();
   }else reply=localReply(text);
   setMessages([...completed,{role:'user',text},{role:'assistant',text:reply}]);setStatus('');
  }catch(error){
   setMessages(completed);setInput(text);
   setStatus(timedOut?'The request timed out. Please try again.':error.name==='AbortError'?'The request was cancelled.':error instanceof TypeError?'Could not connect to the chatbot. Please try again or contact the store.':error.message||'Something went wrong. Please try again.');
  }finally{clearTimeout(timer);abort.current=null;inFlight.current=false;setBusy(false)}
 }
 return <>{open&&<section id="store-chat" className="chat-panel" aria-labelledby="chat-title" onKeyDown={e=>{if(e.key==='Escape')close()}}>
  <div className="chat-head"><span className="assistant-icon"><MessageCircle size={22}/></span><div><strong id="chat-title">Your home assistant</strong><small>{api?'AI-powered · Noha & Hannah':'Brand guide · Noha & Hannah'}</small></div><button ref={closer} className="icon" aria-label="Close chat" onClick={close}><X size={20}/></button></div>
  <div ref={log} className="chat-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation">{messages.map((m,i)=><div key={i} dir="auto" className={'message '+m.role}>{m.text}</div>)}</div>
  <div className="suggestions">{suggestions.map(([label,q])=><button key={label} disabled={busy} onClick={()=>{setInput(q);setStatus('');field.current?.focus()}}>{label}<ArrowUpRight size={13}/></button>)}</div>
  <p className="chat-note">{api?'AI answers can be mistaken. Confirm prices, availability and arrangements with our team.':'AI is not connected yet. Answers use published brand information.'} Please don’t share payment details or other sensitive information.</p>
  {api&&<label className="chat-consent"><input ref={consentField} type="checkbox" checked={consent} disabled={busy} onChange={e=>{setConsent(e.target.checked);setStatus('')}}/><span>I agree to send my messages and recent conversation to Google Gemini to receive replies.</span></label>}
  <form className="chat-form" onSubmit={send}><label className="sr-only" htmlFor="chat-input">Your question</label><input ref={field} id="chat-input" dir="auto" maxLength={2000} value={input} onChange={e=>setInput(e.target.value)} placeholder="How can we help?" autoComplete="off" disabled={busy} required/><button aria-label={busy?'Sending message':'Send message'} disabled={busy||!input.trim()}><Send size={18}/></button></form>
  <p className="chat-status" role="status" aria-live="polite">{status}</p><div className="chat-actions"><a href={'tel:'+brand.mobile}>Call the store</a><a href={'https://wa.me/'+brand.mobile.replace(/\D/g,'')} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><button disabled={busy} onClick={clear}>Clear chat</button></div>
 </section>}<button ref={launcher} className="chat-launcher" aria-expanded={open} aria-controls="store-chat" aria-label={open?'Close home assistant':'Open home assistant'} onClick={()=>open?close():setOpen(true)}>{open?<X size={21}/>:<MessageCircle size={21}/>}<span>{open?'Close':'A little help?'}</span></button></>;
}
