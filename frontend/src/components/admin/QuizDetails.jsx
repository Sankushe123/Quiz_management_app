"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const QuizDetails = () => {
  const { id } = useParams(); // quizId from URL

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!id) return;
    fetchQuizDetails();
  }, [id]);

  const fetchQuizDetails = async () => {
    try {
      const res = await axios.get(`/api/quiz/get/${id}`);
      setQuiz(res.data);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-5 text-gray-600">Loading quiz details...</p>;

  if (!quiz) return <p className="p-5 text-red-500">Quiz not found!</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        Quiz Details: <span className="text-blue-600">{quiz.title}</span>
      </h1>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-700">User Attempts</h2>

      {quiz.attempts?.length === 0 ? (
        <p className="text-gray-500">No one has attempted this quiz yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 font-medium">User Name</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Score</th>
                <th className="p-3 font-medium">Attempt Date</th>
              </tr>
            </thead>

            <tbody>
              {quiz.attempts.map((attempt, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3">{attempt.userId?.name || "Unknown"}</td>
                  <td className="p-3">{attempt.userId?.email || "-"}</td>
                  <td className="p-3 font-semibold text-blue-600">{attempt.score}</td>
                  <td className="p-3">
                    {new Date(attempt.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
