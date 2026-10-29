import test from 'node:test';
import assert from 'node:assert/strict';
import {makeConversation} from '../src/chat-protocol.js';
import {validateMessages} from '../worker/src/index.js';
test('excludes greeting, converts roles, keeps six completed exchanges',()=>{const m=[{role:'assistant',text:'welcome'}];for(let i=0;i<9;i++)m.push({role:'user',text:'q'+i},{role:'assistant',text:'a'+i});const c=makeConversation(m,'next');assert.equal(c.length,13);assert.equal(c[0].text,'q3');assert.ok(!c.some(m=>m.text==='welcome'));assert.ok(validateMessages(c))});
test('trims complete exchanges by UTF-8 byte size',()=>{const m=[{role:'assistant',text:'welcome'}];for(let i=0;i<6;i++)m.push({role:'user',text:'سلام'.repeat(400)},{role:'assistant',text:'پاسخ'.repeat(1000)});const c=makeConversation(m,'ساعت کاری؟');assert.ok(new TextEncoder().encode(JSON.stringify({messages:c})).length<=14000);assert.ok(validateMessages(c));assert.equal(c.at(-1).role,'user')});
