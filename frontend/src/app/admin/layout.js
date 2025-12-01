export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <a href="/admin/list" className="hover:underline">
            Quizzes
          </a>
          <a href="/admin/create" className="hover:underline">
            Create Quiz
          </a>
        </nav>

        
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
