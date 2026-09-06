import { MemoryCategoryInfo, MemoryQuestion } from "./types";

export const memoryCategories: MemoryCategoryInfo[] = [
  {
    id: "family",
    title: "Family",
    description: "People who are close to you",
    emoji: "🏠",
    color: "from-emerald-500 to-green-700",
    position: "left-[8%] top-[18%]",
  },
  {
    id: "childhood",
    title: "Childhood",
    description: "Memories from your younger days",
    emoji: "🌄",
    color: "from-orange-400 to-amber-600",
    position: "left-[36%] top-[8%]",
  },
  {
    id: "personal",
    title: "Personal Life",
    description: "Things about you",
    emoji: "🌿",
    color: "from-teal-500 to-cyan-700",
    position: "right-[7%] top-[17%]",
  },
  {
    id: "food",
    title: "Food & Favorites",
    description: "Foods and things you love",
    emoji: "🍲",
    color: "from-rose-400 to-orange-600",
    position: "left-[17%] bottom-[13%]",
  },
  {
    id: "music",
    title: "Music & Memories",
    description: "Songs and musical memories",
    emoji: "🎵",
    color: "from-purple-500 to-indigo-700",
    position: "right-[28%] bottom-[12%]",
  },
  {
    id: "hobbies",
    title: "Hobbies",
    description: "Things you enjoyed doing",
    emoji: "🌸",
    color: "from-pink-400 to-rose-600",
    position: "right-[5%] bottom-[29%]",
  },
  {
    id: "places",
    title: "Places & Travel",
    description: "Places that hold memories",
    emoji: "🗺️",
    color: "from-blue-400 to-cyan-700",
    position: "left-[44%] bottom-[3%]",
  },
  {
    id: "home",
    title: "Home",
    description: "Memories of home",
    emoji: "🏡",
    color: "from-yellow-400 to-orange-600",
    position: "left-[43%] top-[39%]",
  },
];

export const memoryQuestions: MemoryQuestion[] = [
  {
    id: "family-1",
    category: "family",
    question: "What is your daughter's name?",
    answer: "Ananya",
    options: ["Ananya", "Priya", "Meena", "Sunita"],
    format: "multiple-choice",
  },
  {
    id: "family-2",
    category: "family",
    question: "What is your son's name?",
    answer: "Rahul",
    options: ["Amit", "Rahul", "Arjun", "Vivek"],
    format: "multiple-choice",
  },

  {
    id: "childhood-1",
    category: "childhood",
    question: "Where did you spend your childhood?",
    answer: "Guwahati",
    options: ["Guwahati", "Shillong", "Imphal", "Agartala"],
    format: "multiple-choice",
  },

  {
    id: "personal-1",
    category: "personal",
    question: "What was your profession?",
    answer: "Teacher",
    options: ["Teacher", "Doctor", "Engineer", "Farmer"],
    format: "multiple-choice",
  },

  {
    id: "food-1",
    category: "food",
    question: "What is your favourite food?",
    answer: "Pitha",
    options: ["Pitha", "Dosa", "Roti", "Idli"],
    format: "multiple-choice",
  },

  {
    id: "music-1",
    category: "music",
    question: "What type of music did you enjoy?",
    answer: "Bihu songs",
    options: ["Bihu songs", "Classical music", "Film songs", "Folk songs"],
    format: "multiple-choice",
  },

  {
    id: "hobbies-1",
    category: "hobbies",
    question: "What did you enjoy doing in your free time?",
    answer: "Gardening",
    options: ["Gardening", "Reading", "Cooking", "Painting"],
    format: "multiple-choice",
  },

  {
    id: "places-1",
    category: "places",
    question: "Which place did you enjoy visiting with your family?",
    answer: "Shillong",
    options: ["Shillong", "Delhi", "Mumbai", "Chennai"],
    format: "multiple-choice",
  },

  {
    id: "home-1",
    category: "home",
    question: "What did you usually drink in the morning?",
    answer: "Tea",
    options: ["Tea", "Coffee", "Juice", "Milk"],
    format: "multiple-choice",
  },
];