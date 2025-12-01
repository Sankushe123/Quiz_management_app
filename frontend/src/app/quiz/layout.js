export default function QuizLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Quiz Portal
          </h1>
          <p className="text-gray-500 mt-2">
            Attempt available quizzes and track your progress
          </p>
        </header>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
