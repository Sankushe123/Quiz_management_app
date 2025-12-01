"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { GrFormView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    const [selectedQuiz, setSelectedQuiz] = useState(null); 
    const [modalType, setModalType] = useState(""); 

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
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Quiz List</h1>
                <button
                    onClick={fetchQuizzes}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                    Refresh
                </button>
            </div>

            {loading && <p className="text-gray-500">Loading quizzes...</p>}
            {error && <p className="text-red-600">{error}</p>}

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
                            className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                        >
                            <h2 className="text-lg font-semibold">{quiz.title}</h2>

                            <p className="text-gray-700 text-sm mt-1">
                                Questions: {numQuestions} | Total Marks: {totalMarks}
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                                Created: {new Date(quiz.createdAt).toLocaleDateString()}
                            </p>

                            <div className="mt-3 flex gap-2">
                                <button
                                    className="px-3 py-1 bg-gray-300 border hover:bg-gray-700 hover:text-gray-50 text-md hover:cursor-pointer rounded-md"
                                    onClick={() => {
                                        setSelectedQuiz(quiz);
                                        setModalType("view");
                                        router.push(`/admin/create/${quiz._id}`);
                                    }}
                                >
                                    <GrFormView />
                                </button>
                                <button
                                    className="px-3 py-1 bg-gray-300 border hover:bg-gray-700 hover:text-gray-50 text-md hover:cursor-pointer rounded-md"
                                    onClick={() => {
                                        setSelectedQuiz(quiz);
                                        setModalType("edit");
                                        router.push(`/admin/create/${quiz._id}`);
                                    }}
                                >
                                    <CiEdit />
                                </button>
                                <button
                                    className="px-3 py-1 bg-gray-300 border hover:bg-gray-700 hover:text-gray-50 text-md hover:cursor-pointer rounded-md"
                                    onClick={() => handleDeleteQuiz(quiz._id)}
                                >
                                    <MdOutlineDeleteOutline />
                                </button>
                                <button
                                    className="px-3 py-1 bg-gray-300 border hover:bg-gray-700 hover:text-gray-50 text-md hover:cursor-pointer rounded-md"
                                    onClick={() => router.push(`/admin/quiz-details/${quiz._id}`)}
                                >
                                   
                                    <FaRegChartBar />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizList;
