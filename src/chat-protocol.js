export function makeConversation(completed,text){
 const history=completed.slice(1).map(m=>({role:m.role==='user'?'user':'model',text:m.text}));
 const conversation=[...history.slice(-12),{role:'user',text}];
 while(conversation.length>1&&new TextEncoder().encode(JSON.stringify({messages:conversation})).length>14000)conversation.splice(0,2);
 return conversation;
}
