"use client";
import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import { useParams } from "next/navigation";

const CreateQuiz = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const quizId = params?.id; // get quiz id from route

  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Quiz title
  const [quizTitle, setQuizTitle] = useState("");

  // Question states
  const [questionType, setQuestionType] = useState("mcq");
  const [questionLabel, setQuestionLabel] = useState("");
  const [marks, setMarks] = useState(1);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  // Questions list
  const [questions, setQuestions] = useState([]);

  // Editing
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch quiz if quizId exists
  useEffect(() => {
    if (quizId) fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/quiz/get/${quizId}`);
      const quiz = res.data;

      setQuizTitle(quiz.title || "");
      setQuestions(quiz.questions || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch quiz");
    } finally {
      setLoading(false);
    }
  };

  // Save or update question
  const handleSaveQuestion = () => {
    const newQuestion = {
      questionType,
      questionLabel,
      options: questionType === "mcq" ? options : [],
      correctAnswer,
      marks: Number(marks),
    };

    if (editingIndex !== null) {
      const updated = [...questions];
      updated[editingIndex] = newQuestion;
      setQuestions(updated);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setQuestionLabel("");
    setQuestionType("mcq");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setMarks(1);
    setOpenModal(false);
  };

  const handleDelete = (index) => setQuestions(questions.filter((_, i) => i !== index));
  const handleEdit = (index) => {
    const q = questions[index];
    setQuestionLabel(q.questionLabel);
    setQuestionType(q.questionType);
    setOptions(q.options || ["", "", "", ""]);
    setCorrectAnswer(q.correctAnswer);
    setMarks(q.marks);
    setEditingIndex(index);
    setOpenModal(true);
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    if (!quizTitle.trim()) return alert("Quiz title is required!");
    if (questions.length === 0) return alert("Add at least 1 question!");

    try {
      if (quizId) {
        // Update existing quiz
        await axios.put(`/api/quiz/update/${quizId}`, {
          title: quizTitle,
          questions,
        });
        alert("Quiz updated successfully!");
      } else {
        // Create new quiz
        await axios.post(`/api/quiz/post`, { title: quizTitle, questions });
        alert("Quiz created successfully!");
        setQuizTitle("");
        setQuestions([]);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz");
    }
  };

  if (loading) return <p className="text-gray-500">Loading quiz...</p>;

  return (
    <div className="p-2 max-w-5xl mx-auto">
      {/* Quiz Title */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-1">Quiz Title</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Enter quiz title"
          className="border-b w-full px-4 py-2 outline-0"
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Questions</h2>
        <button
          className="bg-blue-500 text-white rounded-md py-1 px-2 hover:bg-blue-600 hover:cursor-pointer"
          onClick={() => {
            resetQuestionForm();
            setOpenModal(true);
          }}
        >
          Add Question
        </button>
      </div>

      {/* Questions List */}
      <div className="mt-6">
        {questions.length === 0 && <p className="text-gray-600">No questions added yet.</p>}

        {questions.map((q, i) => (
          <div key={i} className="border p-4 mb-3 rounded bg-white shadow">
            <div className="flex justify-between">
              <h4 className="font-bold text-lg">
                Q{i + 1}: {q.questionLabel}
              </h4>

              <div className="flex gap-2">
                <Button size="xs" className="bg-yellow-400" onClick={() => handleEdit(i)}>Edit</Button>
                <Button size="xs" className="bg-red-500 text-white" onClick={() => handleDelete(i)}>Delete</Button>
              </div>
            </div>

            <p className="text-gray-600">
              Type: <b>{q.questionType}</b> | Marks: <b>{q.marks}</b>
            </p>

            {q.questionType === "mcq" && (
              <ul className="list-disc ml-6 mt-2">
                {q.options.map((opt, idx) => <li key={idx}>{opt}</li>)}
              </ul>
            )}

            <p className="mt-2">
              <b>Correct Answer:</b> {q.correctAnswer}
            </p>
          </div>
        ))}
      </div>

      {/* Submit Quiz */}
      <div className="mt-6">
        <Button className="bg-green-600 text-white px-6 py-2" onClick={handleSubmitQuiz}>
          {quizId ? "Update Quiz" : "Submit Quiz"}
        </Button>
      </div>

      {/* Question Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-xl shadow-xl border border-gray-200 animate-fadeIn">
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-800">
                {editingIndex !== null ? "Edit Question" : "Add Question"}
              </h3>
              <button onClick={() => setOpenModal(false)} className="text-lg text-gray-500 hover:text-gray-900">✕</button>
            </div>

            <div className="px-4 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Question</label>
                <input
                  type="text"
                  value={questionLabel}
                  onChange={(e) => setQuestionLabel(e.target.value)}
                  className="w-full px-3 py-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter question"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full px-3 py-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="true_false">True / False</option>
                    <option value="text">Text</option>
                  </select>
                </div>

                <div className="w-24">
                  <label className="block text-sm font-medium mb-1">Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full px-3 py-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {questionType === "mcq" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Options</label>
                  <div className="grid grid-cols-2 gap-2">
                    {options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...options];
                          updated[idx] = e.target.value;
                          setOptions(updated);
                        }}
                        className="px-3 py-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                        placeholder={`Option ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Correct Answer</label>
                <input
                  type="text"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full px-3 py-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                  placeholder="Correct answer"
                />
              </div>
            </div>

            <div className="px-4 py-3 flex justify-end">
              <button
                onClick={handleSaveQuestion}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-white rounded-md text-sm"
              >
                {editingIndex !== null ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
