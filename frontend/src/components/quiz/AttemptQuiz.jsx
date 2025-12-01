"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

const AttemptQuiz = ({ quizId }) => {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600);
    const [user, setUser] = useState({ name: "", email: "" });
    const [started, setStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const router = useRouter();
    const params = useParams();
    quizId = params.id;

    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch Quiz
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`/api/quiz/get/${quizId}`);
                setQuiz(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    // Timer
    useEffect(() => {
        if (!started || submitted || timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, started, submitted]);

    // Start Quiz
    const handleStart = () => {
        if (!user.name.trim() || !user.email.trim()) {
            alert("Please enter name and email!");
            return;
        }
        setStarted(true);
    };

    // Calculate Score
    const calculateScore = () => {
        let score = 0;

        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                score += q.marks || 1;
            }
        });

        return score;
    };

    // Submit test (send to backend)
    const handleSubmit = async () => {
        const finalScore = calculateScore();
        setSubmitted(true);

        try {
            await axios.post(`/api/quiz/quiz/${quizId}/submit`, {
                name: user.name,
                email: user.email,
                score: finalScore,
            });

            console.log("Attempt saved to backend");
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    };

    // Show Result page
    const handleShowResult = () => {
        router.push(`/quiz/quiz-result?answers=${encodeURIComponent(
            JSON.stringify(answers)
        )}&quiz=${encodeURIComponent(JSON.stringify(quiz))}`
        );
    };

    const handleAnswer = (option) =>
        setAnswers({ ...answers, [currentQuestion]: option });

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1)
            setCurrentQuestion(currentQuestion + 1);
    };

    const handlePrev = () => {
        if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`;
    };

    if (loading) return <p>Loading quiz...</p>;
    if (!quiz) return <p>Quiz not found</p>;

    if (!started) {
        return (
            <div className="h-fit flex items-center justify-center bg-gray-100">
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4">
                        Enter Your Details
                    </h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={user.name}
                        onChange={(e) =>
                            setUser({ ...user, name: e.target.value })
                        }
                        className="w-full mb-3 px-3 py-2 border rounded"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                        }
                        className="w-full mb-3 px-3 py-2 border rounded"
                    />
                    <button
                        onClick={handleStart}
                        className="w-full bg-blue-500 text-white py-2 rounded"
                    >
                        Start Quiz
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = quiz.questions[currentQuestion];

    return (
        <div className="bg-gray-100 p-4 flex justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 flex gap-6 w-[1200px]">
                {/* Left */}
                <div className="flex-1">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-semibold">{quiz.title}</h2>
                        <div className="bg-gray-200 px-3 py-1 rounded text-sm">
                            Time: {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="border p-4 rounded-lg mb-4">
                        <p className="font-medium mb-3">
                            Q{currentQuestion + 1}.{" "}
                            {currentQ.questionLabel} ({currentQ.marks} marks)
                        </p>

                        {currentQ.questionType === "mcq" &&
                            currentQ.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(opt)}
                                    className={`w-full text-left px-4 py-2 rounded border mb-2 ${answers[currentQuestion] === opt
                                            ? "bg-blue-500 text-white"
                                            : "bg-white hover:bg-gray-100"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}

                        {/* TRUE / FALSE QUESTIONS */}
                        {currentQ.questionType === "true_false" && (
                            <>
                                <button
                                    onClick={() => handleAnswer("True")}
                                    className={`w-full text-left px-4 py-2 rounded border mb-2 ${answers[currentQuestion] === "True"
                                            ? "bg-blue-500 text-white"
                                            : "bg-white hover:bg-gray-100"
                                        }`}
                                >
                                    True
                                </button>

                                <button
                                    onClick={() => handleAnswer("False")}
                                    className={`w-full text-left px-4 py-2 rounded border mb-2 ${answers[currentQuestion] === "False"
                                            ? "bg-blue-500 text-white"
                                            : "bg-white hover:bg-gray-100"
                                        }`}
                                >
                                    False
                                </button>
                            </>
                        )}

                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={handlePrev}
                            disabled={currentQuestion === 0}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {currentQuestion < quiz.questions.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Next
                            </button>
                        ) : !submitted ? (
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Submit Test
                            </button>
                        ) : (
                            <button
                                onClick={handleShowResult}
                                className="px-4 py-2 bg-purple-500 text-white rounded"
                            >
                                Show Result
                            </button>
                        )}
                    </div>
                </div>

                {/* Right */}
                <div className="w-60 bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-semibold mb-2 text-center">
                        Questions
                    </h3>

                    <div className="grid grid-cols-5 gap-2">
                        {quiz.questions.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestion(idx)}
                                className={`px-2 py-1 rounded ${currentQuestion === idx
                                        ? "bg-blue-500 text-white"
                                        : answers[idx]
                                            ? "bg-green-300"
                                            : "bg-gray-200"
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttemptQuiz;
