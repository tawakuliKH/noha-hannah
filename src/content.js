// Confirm real products, contact details and policies here before launch.

export const brand = {
  name: 'NOHA & HANNAH',
  domain: 'https://nohannah.co.uk',
  promise: 'Beautiful homes. Everyday prices.',
  email: 'supports@nohannah.co.uk',
  phone: '01133183217',
  mobile: '07466353588',
  address: '221 Harehills Lane, Leeds, LS8 3QH',
  company: 'ZWAN ENTERPRISE LIMITED',
  hours:
    'Monday to Saturday: 10 AM–8 PM. Sunday: 10 AM–7 PM (UK local time).',
};

export const collections = [
  {
    id: 'living',
    name: 'Living, beautifully',
    label: 'Living room',
    image: 'living',
    note: 'A little more warmth. A little more you.',
    text:
      'Explore a softer approach to your living space: layered textures, warm neutrals and thoughtful details that bring a room together.',
  },
  {
    id: 'bedroom',
    name: 'Your softer sanctuary',
    label: 'Bedroom',
    image: 'bedroom',
    note: 'Make room for slower mornings.',
    text:
      'Take inspiration from restful colours, layered bedding and natural textures for a bedroom that feels calm and personal.',
  },
  {
    id: 'details',
    name: 'The finishing touches',
    label: 'Everyday details',
    image: 'details',
    note: 'Small changes. A lovely difference.',
    text:
      'Discover the styling possibilities of considered accents, comforting textures and useful pieces that make a house feel like home.',
  },
];

export const policies = {
  delivery:
    'Shop in store. Delivery can be arranged for selected items, depending on your delivery address and order amount. Contact us to confirm eligibility, charges and arrangements before purchasing.',

  returns:
    'Voluntary returns are accepted where a warranty was given at the time of purchase, subject to the agreed terms. Items must be in almost-new condition; customer-damaged or broken items are not accepted under this voluntary policy. Electrical warranties apply only to specific items and must be confirmed at purchase. These conditions do not affect your statutory rights. If an item is faulty, not as described or not fit for purpose, contact us: your legal rights apply regardless of whether a warranty was provided.',

  payments:
    'All types of payment are accepted in store. Contact the team if you would like to confirm a particular payment method. This website does not process payments.',
};

export const faqs = [
  [
    'What is Noha & Hannah?',
    'Noha & Hannah is a homeware and home living shop by ZWAN ENTERPRISE LIMITED at 221 Harehills Lane, Harehills, Leeds, LS8 3QH. Visit us seven days a week to explore our range and ask our team about current availability. Delivery can be arranged for selected items, depending on your address and order amount.',
  ],
  [
    'How can I shop?',
    'Visit us at 221 Harehills Lane, Leeds, LS8 3QH to shop in store. Contact us for prices and current availability. This website offers inspiration and enquiries; it does not have an online checkout.',
  ],
  ['What are your opening hours?', brand.hours],
  ['Can you arrange delivery?', policies.delivery],
  ['What are the returns and warranty terms?', policies.returns],
  ['Which payment methods do you accept?', policies.payments],
];

export function localReply(message) {
  const q = message.toLowerCase();

  const contact =
    `Email ${brand.email}, call ${brand.phone} or ${brand.mobile}.`;

  const replies = [];

  if (/deliver|shipping/.test(q)) {
    replies.push(policies.delivery);
  }

  if (/return|refund|warrant|broken|fault/.test(q)) {
    replies.push(policies.returns);
  }

  if (/pay|cash|card/.test(q)) {
    replies.push(policies.payments);
  }

  if (/hours|open|sunday|monday|saturday|close/.test(q)) {
    replies.push(brand.hours);
  }

  if (/contact|email|phone|telephone/.test(q)) {
    replies.push(contact);
  }

  if (/address|location|where.*(?:store|shop|you)|visit|postcode|directions/.test(q)) {
    replies.push(
      'Find us at ' + brand.address + '. ' + brand.hours + ' ' + contact
    );
  }

  if (/price|stock|buy|order|available|availability/.test(q)) {
    replies.push(
      'Shop in store. Contact the team for current prices and availability. No online checkout is available on this website. ' +
        contact
    );
  }

  if (replies.length) {
    return [...new Set(replies)].join('\n\n');
  }

  if (/bed|sleep/.test(q)) {
    return (
      'For a calmer bedroom, start with a warm neutral base, then layer bedding and a contrasting texture. ' +
      'Explore our Bedroom inspiration for a starting point. Contact us to ask about available products.'
    );
  }

  if (/living|style|room|decor/.test(q)) {
    return (
      'Start with one warm neutral, add a tactile fabric, and leave a little breathing room around your favourite details. ' +
      'Explore the 3D room to try different sofa tones. It is an illustrative scene, not a catalogue of our stock.'
    );
  }

  return (
    faqs[0][1] +
    ' Our promise is: Beautiful homes. Everyday prices. ' +
    'I can help with opening hours, contact details, delivery, payments and warranty information.'
  );
}