import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] flex items-center justify-center p-6">
      <div className="bg-white dark:bg-[#1C1C1E] p-10 rounded-3xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-amber-500 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Page not found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-b from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/30 transition-all"
        >
          <Home size={16} />
          Go to Login
        </Link>
      </div>
    </div>
  );
}