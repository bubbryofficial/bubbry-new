export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-5xl font-bold text-blue-600 mb-6">
        Welcome to Bubbry 🚀
      </h1>

      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        India’s smart local shop platform. Manage your business, orders,
        and customers in one simple dashboard.
      </p>

      <div className="flex gap-4">
        <a
          href="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
        >
          Create Account
        </a>

        <a
          href="/login"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-100"
        >
          Login
        </a>
      </div>
    </main>
  );
}