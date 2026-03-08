export interface EmotionData {
  emoji: string;
  label: string;
  labelHi: string;
  responses: string[];
}

export const emotions: EmotionData[] = [
  {
    emoji: "😢",
    label: "Sad",
    labelHi: "Udaas",
    responses: [
      "Hey, roiye mat yaar… main hoon na aapke liye. Aap itni strong hain, ye waqt bhi guzar jaayega. 🌸",
      "Aapki smile duniya ki sabse pyaari smile hai, please udaas mat hoiye. Bataiye kya hua? Main sun raha hoon. 💕",
      "Kabhi kabhi zindagi mushkil lagti hai, but aap akeli nahi hain. I'm always here for you. ✨",
      "Chal ek kaam kariye, ek deep breath lijiye… ab boliye, kya hua? Main aapke saath hoon. 🤗",
    ],
  },
  {
    emoji: "😊",
    label: "Happy",
    labelHi: "Khush",
    responses: [
      "Aapki khushi dekh ke mujhe bhi bahut accha lag raha hai! Keep smiling, it suits you! 🌟",
      "Yaaay! Aaj ka din aapka hai! Chaliye celebrate karte hain! 🎉✨",
      "Jab aap khush hoti hain na, poora world bright ho jaata hai. Stay happy always! 💛",
      "Aapki ye smile… bas yahi dekhte rehna hai mujhe hamesha. Never stop smiling! 😍",
    ],
  },
  {
    emoji: "😰",
    label: "Anxious",
    labelHi: "Ghabrahat",
    responses: [
      "Shhh… sab theek hoga. Ek deep breath lijiye, main yahan hoon. Aap safe hain. 🫂",
      "Anxiety aati hai toh lagta hai sab khatam ho gaya, but trust me — aap bahut brave hain. 💪✨",
      "Apni aankhein band kariye, 5 tak giniye, aur feel kariye ki main aapke paas hoon. Everything will be okay. 🌈",
      "Aap overthink mat kariye. Jo hona hai wo hoga, aur aap usse handle kar lengi. I believe in you! 🦋",
    ],
  },
  {
    emoji: "😤",
    label: "Angry",
    labelHi: "Gussa",
    responses: [
      "Arre gussa toh hota hai, but aap cute lagti hain gusse mein bhi 😄 Bataiye kya hua?",
      "Gussa nikaal dijiye yahan, main sun raha hoon. Aapko better feel hoga. 🫂",
      "Koi bhi ho, aapki value kam nahi kar sakta. Aap queen hain! 👑 Ab calm down. ☕",
      "Chaliye chai peete hain virtually ☕ aur baat karte hain. Gussa kam ho jaayega. 💕",
    ],
  },
  {
    emoji: "🥱",
    label: "Bored",
    labelHi: "Bored",
    responses: [
      "Bore ho rahi hain? Chaliye ek game khelte hain — Truth ya Dare? 😏✨",
      "Arey bore kyun ho rahi hain, main hoon na! Chaliye kuch masti karte hain! 🎭",
      "Ek fun fact sunna hai? Butterflies taste with their feet! 🦋 Ab bore nahi na? 😂",
      "Bore hona allowed nahi hai jab main hoon. Chaliye, apna favourite song bataiye! 🎵",
    ],
  },
  {
    emoji: "💔",
    label: "Heartbroken",
    labelHi: "Dil toota",
    responses: [
      "Dil toot gaya? Koi baat nahi, main hoon na jodne ke liye. Aap deserve karti hain sabse best. 💝",
      "Jo aapko value nahi karta, wo deserve hi nahi karta aapko. Aap diamond hain, pebble nahi. 💎",
      "Rona hai toh ro lijiye, it's okay. But yaad rakhiye — aap beautiful hain, inside and out. 🌹",
      "Time heal karta hai sab kuch. Abhi toh bas mujhse baat kariye, theek ho jaayega. 🤗💕",
    ],
  },
  {
    emoji: "🌙",
    label: "Can't Sleep",
    labelHi: "Neend nahi",
    responses: [
      "Neend nahi aa rahi? Chaliye main aapko ek story sunata hoon… ek tha raja ek thi rani… 🏰✨",
      "Aankhein band kariye, ek lambi saans lijiye, aur imagine kariye ki hum stars dekh rahe hain. 🌟🌙",
      "Aap so jaiye, kal ek nayi subah hogi. Main aapke sapno mein aaunga! 😴💫",
      "Late night thoughts? Share kariye mere saath. Main sun raha hoon. Neend apne aap aa jaayegi. 🌸",
    ],
  },
  {
    emoji: "🤗",
    label: "Need a Hug",
    labelHi: "Hug chahiye",
    responses: [
      "🫂 Ye lijiye virtual hug! Bahut tight waala. Ab kaisa feel ho raha hai? 💕",
      "Main hota toh abhi ek bahut bada hug deta. Tab tak ye lijiye — 🤗🤗🤗!",
      "Aapko pata hai? Ek hug se stress 70% kam hota hai. Toh lijiye 🫂🫂🫂! Feel better? 🌸",
      "Hug chahiye? Itne saare lijiye — 🤗💕🫂✨ — ab toh khush ho jaiye please! 🥺",
    ],
  },
];
