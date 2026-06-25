// Seed conversations keyed by propertyId. Each conversation is a realistic
// buyer-promoter exchange referencing real units/prices from that property.

export const CHAT_SEEDS = {
  'green-valley-residency': [
    { id: 'm1', sender: 'user', text: 'Hi, is there any 2 BHK available on a higher floor? Preferably 5th or above.', time: '10:14 AM' },
    { id: 'm2', sender: 'promoter', text: 'Hello! Yes, we have Unit 5C available — 2 BHK, 1050 sq ft, ₹36.5 L. It faces the courtyard side, away from the main road.', time: '10:17 AM' },
    { id: 'm3', sender: 'user', text: 'What is the booking amount and is the 20:80 payment plan still running?', time: '10:19 AM' },
    { id: 'm4', sender: 'promoter', text: 'Booking amount is ₹50,000. The 20:80 plan is active till end of this month — 20% on booking + agreement, 80% linked to construction milestones till possession.', time: '10:21 AM' },
    { id: 'm5', sender: 'user', text: 'Can I get the floor plan and a site visit slot this weekend?', time: '10:22 AM' },
    { id: 'm6', sender: 'promoter', text: 'Sure, sending the floor plan now. For site visit, Saturday 11 AM or 4 PM both work — which suits you?', time: '10:24 AM' },
  ],
  'iit-vista-residency': [
    { id: 'm1', sender: 'user', text: 'Is Unit 4A still available? I saw it listed as a corner unit, 3 BHK.', time: '6:02 PM' },
    { id: 'm2', sender: 'promoter', text: 'Yes, Unit 4A is currently available — 3 BHK, 1450 sq ft, ₹58 L, corner unit with cross-ventilation on two sides.', time: '6:05 PM' },
    { id: 'm3', sender: 'user', text: 'What is the booking amount?', time: '6:06 PM' },
    { id: 'm4', sender: 'promoter', text: '₹50,000 booking amount to block the unit, fully adjustable against the total cost.', time: '6:07 PM' },
    { id: 'm5', sender: 'user', text: 'Good. Does this come with a covered parking slot included, or is that extra?', time: '6:09 PM' },
    { id: 'm6', sender: 'promoter', text: 'One covered parking slot is included for all 3 BHK and 4 BHK units. 2 BHK units get open parking unless upgraded for ₹1.2 L.', time: '6:11 PM' },
  ],
  'haldia-port-residency': [
    { id: 'm1', sender: 'user', text: 'I work at the Haldia refinery — is the shuttle service to the gate confirmed or still planned?', time: '11:30 AM' },
    { id: 'm2', sender: 'promoter', text: 'It\u2019s confirmed for possession — we\u2019ve tied up with a local operator for a shuttle at shift-change timings. Final schedule will be shared closer to handover.', time: '11:34 AM' },
    { id: 'm3', sender: 'user', text: 'That\u2019s good to know. What 3 BHK options do you have between 1500-1700 sq ft?', time: '11:36 AM' },
    { id: 'm4', sender: 'promoter', text: 'We have a 1500 sq ft unit at ₹62 L and a 1680 sq ft unit at ₹74 L, both on floors 6-9, multiple units available on each.', time: '11:39 AM' },
    { id: 'm5', sender: 'user', text: 'Can you share the payment schedule tied to construction milestones?', time: '11:40 AM' },
    { id: 'm6', sender: 'promoter', text: 'Of course, sending the construction-linked payment schedule PDF now. Possession is targeted for August 2027.', time: '11:42 AM' },
  ],
  'digha-sands-residency': [
    { id: 'm1', sender: 'user', text: 'Are any of the sea-facing 2 BHK units between floors 4-7 still open? Saw them listed at ₹68 L.', time: '4:45 PM' },
    { id: 'm2', sender: 'promoter', text: 'Yes, we currently have units open on the 4th, 6th and 7th floor in that sea-facing block, all at ₹68 L for 1100 sq ft.', time: '4:48 PM' },
    { id: 'm3', sender: 'user', text: 'I won\u2019t be living there full time. Does the rental management service apply to this unit type too?', time: '4:50 PM' },
    { id: 'm4', sender: 'promoter', text: 'Yes, the pilot rental program covers all sea-facing 2 BHK and 3 BHK units. We handle bookings and housekeeping; owners get a monthly settlement.', time: '4:53 PM' },
    { id: 'm5', sender: 'user', text: 'What\u2019s the booking amount to hold a unit while I decide?', time: '4:54 PM' },
    { id: 'm6', sender: 'promoter', text: '₹50,000 holds it for 7 days. After that we\u2019d need the formal booking amount to keep it reserved.', time: '4:56 PM' },
  ],
}

export const DEFAULT_CHAT_SEED = [
  { id: 'm1', sender: 'user', text: 'Hi, is this unit still available?', time: 'Just now' },
  { id: 'm2', sender: 'promoter', text: 'Hello! Thanks for your interest — let me check the current availability and get back to you with details and pricing.', time: 'Just now' },
]
