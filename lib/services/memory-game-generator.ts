import type { Memory, GeneratedActivity } from "@/lib/types";

export function generateMemoryActivity(memory: Memory): GeneratedActivity {
  let question = "";
  let options: string[] = [];
  let correctAnswer = "";

  if (memory.category === "trip" && memory.people && memory.people.length > 0) {
    correctAnswer = memory.people[0];
    const distractor1 = "Amit";
    const distractor2 = "Suresh";
    question = `Who accompanied Meena on the ${memory.title}?`;
    options = [correctAnswer, distractor1, distractor2].sort(() => Math.random() - 0.5);
  } else if (memory.category === "food") {
    correctAnswer = "Momos";
    question = `What is Meena's favourite dish remembered in "${memory.title}"?`;
    options = ["Momos", "Samosa", "Dosa"].sort(() => Math.random() - 0.5);
  } else if (memory.category === "family" && memory.people && memory.people.length > 0) {
    correctAnswer = memory.people[0];
    question = `Which family member spent time with Meena in "${memory.title}"?`;
    options = [correctAnswer, "Rohan", "Vikram"].sort(() => Math.random() - 0.5);
  } else {
    correctAnswer = memory.title;
    question = `Which special memory features "${memory.title}"?`;
    options = [correctAnswer, "Diwali Celebration", "Summer Picnic"].sort(() => Math.random() - 0.5);
  }

  return {
    question,
    options,
    correctAnswer,
    difficulty: "Easy",
    sourceMemoryId: memory.id,
  };
}
