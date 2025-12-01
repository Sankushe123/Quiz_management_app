import { redirect } from "next/navigation";

export default async function HomePage() {
  redirect("/quiz/quiz-list");
  
  return null;
}
