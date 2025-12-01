"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

const QuizResult = () => {
  const searchParams = useSearchParams();
  const answers = JSON.parse(searchParams.get("answers") || "{}");
  const quiz = JSON.parse(searchParams.get("quiz") || "{}");

  const score = quiz.questions.reduce((acc, q, idx) => {
    if (answers[idx] === q.correctAnswer) acc += q.marks;
    return acc;
  }, 0);

  return (
    <div className=" bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Your Score: {score}</h2>

        <h3 className="font-semibold mb-2">Detailed Answers:</h3>
        <div className="space-y-3">
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="border p-3 rounded-lg">
              <p className="font-medium">
                Q{idx + 1}: {q.questionLabel}
              </p>
              <p>
                Your Answer:{" "}
                <span className={answers[idx] === q.correctAnswer ? "text-green-600" : "text-red-600"}>
                  {answers[idx] || "Not Answered"}
                </span>
              </p>
              <p>Correct Answer: {q.correctAnswer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
