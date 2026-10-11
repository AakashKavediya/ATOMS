import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ExternalLink,
  ClipboardPaste,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { ROLE_HOME, ROUTES } from '../../lib/constants';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Fallback for testing — hardcoded URL that opens in browser
function buildGoogleOAuthUrl() {
  const base = 'https://developers.google.com/oauthplayground/';
  const params = [
    '#step1',
    '&scopes=openid%20email%20profile',
    '&oauthEndpointSelect=Google',
    '&includeCredentials=checked',
    '&accessTokenType=bearer',
    '&accessType=offline',
    '&prompt=consent',
    '&response_type=code',
    '&redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground',
    GOOGLE_CLIENT_ID ? `&client_id=${GOOGLE_CLIENT_ID}` : '',
  ].join('');
  return base + params;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    signInWithPassword,
    signInWithGoogle,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idToken, setIdToken] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    clearError();
    setLocalError('');
  }, [mode]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    try {
      const user = await signInWithPassword({ email, password });
      const home = ROLE_HOME[user.role] || ROUTES.LOGIN;
      navigate(home, { replace: true });
    } catch {
      // handled by redux
    }
  };

  const handleOpenGoogle = () => {
    const url = buildGoogleOAuthUrl();
    console.log('[Google] Opening:', url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    const token = idToken.trim();
    if (!token) {
      setLocalError('Please paste the ID token');
      return;
    }
    if (!token.startsWith('eyJ')) {
      setLocalError('That doesn\'t look like a valid ID token (should start with "eyJ")');
      return;
    }

    try {
      const user = await signInWithGoogle(token);
      const home = ROLE_HOME[user.role] || ROUTES.LOGIN;
      navigate(home, { replace: true });
    } catch {
      // handled by redux
    }
  };

  const displayError = localError || error;

  return (
    <div className="relative min-h-screen bg-[#F2F2F7] dark:bg-[#000000] font-sans antialiased overflow-hidden flex items-center justify-center p-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20 mb-4">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome to ATOMS
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            Sign in to continue to your dashboard
          </p>
        </div>

        <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-[#2C2C2E] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-6 sm:p-8">

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-[#2C2C2E] mb-6">
            <button
              type="button"
              onClick={() => setMode('password')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'password'
                  ? 'bg-white dark:bg-[#1C1C1E] text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setMode('google')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'google'
                  ? 'bg-white dark:bg-[#1C1C1E] text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Google
            </button>
          </div>

          {displayError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 mb-4">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                {displayError}
              </p>
            </div>
          )}

          {/* ============ GOOGLE MODE ============ */}
          {mode === 'google' && (
            <div className="space-y-4">

              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                      Open Google in your browser
                    </p>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 mb-3 leading-relaxed">
                      A browser tab will open. Sign in with Google, then copy the <strong>id_token</strong> value.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenGoogle}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 transition-all active:scale-95"
                    >
                      <ExternalLink size={12} />
                      Open Google Sign-In
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                      Paste the id_token
                    </p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-relaxed">
                      Look for the field labeled <strong>id_token</strong> in the response. Copy the whole value.
                    </p>
                  </div>
                </div>
              </div>

              {/* Paste form */}
              <form onSubmit={handleGoogleSubmit} className="space-y-3">
                <div className="relative">
                  <ClipboardPaste
                    size={14}
                    className="absolute left-3.5 top-4 text-gray-400 pointer-events-none"
                  />
                  <textarea
                    value={idToken}
                    onChange={(e) => setIdToken(e.target.value)}
                    placeholder="Paste the id_token here (starts with eyJ...)"
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C2C2E] bg-white dark:bg-[#2C2C2E] text-xs text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all resize-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !idToken.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-b from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Sign in with this token
                    </>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setMode('password')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2C2C2E] transition-all"
              >
                <ArrowLeft size={12} />
                Back to email login
              </button>
            </div>
          )}

          {/* ============ PASSWORD MODE ============ */}
          {mode === 'password' && (
            <>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@college.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C2C2E] bg-white dark:bg-[#2C2C2E] text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2C2C2E] bg-white dark:bg-[#2C2C2E] text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-b from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#2C2C2E] text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to={ROUTES.REGISTER} className="font-bold text-amber-600 dark:text-amber-400 hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-6 uppercase tracking-[0.2em] font-bold">
          ATOMS v1.0
        </p>
      </div>
    </div>
  );
}