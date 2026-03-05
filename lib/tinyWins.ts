import type { TinyWin } from "@/types";

export const TINY_WINS: TinyWin[] = [
  // body (8 items)
  { id: "tw1", text: "Drink one full sip of water", category: "body", emoji: "💧" },
  { id: "tw2", text: "Take three slow deep breaths", category: "body", emoji: "🌬️" },
  { id: "tw3", text: "Stretch your arms above your head", category: "body", emoji: "🙆" },
  { id: "tw4", text: "Stand up and sit back down once", category: "body", emoji: "🪑" },
  { id: "tw5", text: "Roll your shoulders back slowly", category: "body", emoji: "✨" },
  { id: "tw6", text: "Unclench your jaw right now", category: "body", emoji: "😮‍💨" },
  { id: "tw7", text: "Put your feet flat on the floor", category: "body", emoji: "🦶" },
  { id: "tw8", text: "Blink slowly three times", category: "body", emoji: "👁️" },

  // social (7 items)
  { id: "tw9", text: "Send one emoji to someone you love", category: "social", emoji: "💌" },
  { id: "tw10", text: "Read (don't reply) one message", category: "social", emoji: "📱" },
  { id: "tw11", text: "Think of one person who likes you", category: "social", emoji: "🫂" },
  { id: "tw12", text: "Write 'thinking of you' to anyone", category: "social", emoji: "💭" },
  { id: "tw13", text: "React to one social media post", category: "social", emoji: "❤️" },
  { id: "tw14", text: "Tell someone one true nice thing", category: "social", emoji: "🌸" },
  { id: "tw15", text: "Text 'hey' to a friend you miss", category: "social", emoji: "👋" },

  // environment (8 items)
  { id: "tw16", text: "Move one thing to where it belongs", category: "environment", emoji: "🏠" },
  { id: "tw17", text: "Open the window a tiny crack", category: "environment", emoji: "🪟" },
  { id: "tw18", text: "Throw away one piece of trash", category: "environment", emoji: "🗑️" },
  { id: "tw19", text: "Put one cup or glass in the sink", category: "environment", emoji: "🫙" },
  { id: "tw20", text: "Turn on a soft light nearby", category: "environment", emoji: "🕯️" },
  { id: "tw21", text: "Close three unused browser tabs", category: "environment", emoji: "💻" },
  { id: "tw22", text: "Fluff or straighten one pillow", category: "environment", emoji: "🛋️" },
  { id: "tw23", text: "Put your phone face-down for 5 min", category: "environment", emoji: "📵" },

  // self (9 items)
  { id: "tw24", text: "Write one word about how you feel", category: "self", emoji: "📝" },
  { id: "tw25", text: "Say one kind thing to yourself aloud", category: "self", emoji: "🗣️" },
  { id: "tw26", text: "Name three things you can see", category: "self", emoji: "👀" },
  { id: "tw27", text: "Apply lip balm or hand cream", category: "self", emoji: "💄" },
  { id: "tw28", text: "Look at something beautiful for 10s", category: "self", emoji: "🌺" },
  { id: "tw29", text: "Hum or sing one line of any song", category: "self", emoji: "🎵" },
  { id: "tw30", text: "Write tomorrow's date at the top of a page", category: "self", emoji: "📅" },
  { id: "tw31", text: "Put on a scent you love", category: "self", emoji: "🌹" },
  { id: "tw32", text: "Smile at yourself in a reflection", category: "self", emoji: "🪞" },
];

export function getRandomTinyWin(): TinyWin {
  return TINY_WINS[Math.floor(Math.random() * TINY_WINS.length)];
}

export function getWinsByCategory(
  category: TinyWin["category"]
): TinyWin[] {
  return TINY_WINS.filter((w) => w.category === category);
}
