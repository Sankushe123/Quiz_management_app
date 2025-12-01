"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Quizlistpage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    const [selectedQuiz, setSelectedQuiz] = useState(null); // For view/edit
    const [modalType, setModalType] = useState(""); // "view" or "edit"

    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.get("/api/quiz/get");
            setQuizzes(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch quizzes.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuiz = async (id) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;

        try {
            await axios.delete(`/api/quiz/delete/${id}`);
            setQuizzes(quizzes.filter((q) => q._id !== id));
            alert("Quiz deleted successfully!");
        } catch (err) {
            alert("Failed to delete quiz");
        }
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((quiz) => {
                    const totalMarks = quiz.questions.reduce(
                        (sum, q) => sum + (q.marks || 0),
                        0
                    );
                    const numQuestions = quiz.questions.length;

                    return (
                        <div
                            key={quiz._id}
                            onClick={()=>{router.push(`/quiz/attempt-quiz/${quiz._id}`)}}
                            className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition hover:cursor-pointer"
                        >
                            <h2 className="text-lg font-semibold">{quiz.title}</h2>

                            <p className="text-gray-700 text-sm mt-1">
                                Questions: {numQuestions} | Total Marks: {totalMarks}
                            </p>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Quizlistpage;

