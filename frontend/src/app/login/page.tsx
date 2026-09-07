'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { sound } from '@/lib/sound';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setErrorMsg(null);
    setLoading(true);

    try {
      const user = await login({ identifier, password });
      sound.playCorrect();
      showToast(`Welcome back${user.display_name ? ', ' + user.display_name : ''}!`, 'success');
      router.push('/learn');
    } catch (err: any) {
      sound.playWrong();
      const msg = err.message || 'Incorrect username or password.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    sound.playClick();
    setIdentifier('learner');
    setPassword('password');
    setErrorMsg(null);
    setLoading(true);
    try {
      await demoLogin();
      sound.playCorrect();
      showToast('Welcome! Fresh demo session started.', 'success');
      router.push('/learn');
    } catch (err: any) {
      sound.playWrong();
      setErrorMsg(err.message || 'Could not log in as demo user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col justify-between p-6 select-none font-sans">
      {/* Top Header with Close and Signup Link */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          onClick={() => sound.playClick()}
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#202f36] transition"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </Link>

        <Link
          href="/register"
          onClick={() => sound.playClick()}
          className="duo-button duo-button-blue text-xs uppercase px-5 py-2.5 tracking-wider font-black"
        >
          SIGN UP
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-sm w-full mx-auto my-auto py-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white text-center mb-8 tracking-tight">
          Log in
        </h1>

        {/* Demo Fast Login Banner */}
        <div 
          onClick={handleDemoLogin}
          className="mb-6 p-3.5 bg-[#1a2d36] hover:bg-[#203945] border-2 border-[#2b3a42] hover:border-[#58cc02] rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition active:scale-[0.99] group"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#58cc02] group-hover:rotate-12 transition-transform shrink-0" />
            <div className="text-xs">
              <span className="font-black text-white block">Try Demo Account (Fresh Start)</span>
              <span className="text-gray-400 font-bold">learner / password</span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDemoLogin();
            }}
            className="duo-button duo-button-green text-[11px] uppercase px-3 py-1.5 font-black tracking-wider"
          >
            Auto Fill
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-[#ff4b4b]/15 border-2 border-[#ff4b4b] rounded-2xl text-xs font-bold text-[#ff4b4b] flex items-center gap-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username Input */}
          <div className="space-y-1">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email or username"
              className="w-full bg-[#19262c] border-2 border-[#2b3a42] focus:border-[#1cb0f6] rounded-2xl px-4 py-3.5 text-white font-bold text-sm outline-none transition placeholder-gray-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#19262c] border-2 border-[#2b3a42] focus:border-[#1cb0f6] rounded-2xl px-4 py-3.5 pr-20 text-white font-bold text-sm outline-none transition placeholder-gray-500"
              required
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-black text-gray-400">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  showToast('Password reset link sent to registered email!', 'success');
                }}
                className="text-[#1cb0f6] hover:underline uppercase text-[11px]"
              >
                FORGOT?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="duo-button duo-button-blue w-full py-4 font-black uppercase text-sm tracking-wider mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'LOG IN'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="h-[2px] bg-[#202f36] flex-1"></div>
          <span className="px-4 text-xs font-black text-gray-500 uppercase tracking-widest">
            OR
          </span>
          <div className="h-[2px] bg-[#202f36] flex-1"></div>
        </div>

        {/* Social Logins */}
        <div className="space-y-3">
          {/* Google */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-[#19262c] hover:bg-[#202f36] border-2 border-[#2b3a42] rounded-2xl py-3 px-4 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-wider text-white transition active:translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>GOOGLE</span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-[#19262c] hover:bg-[#202f36] border-2 border-[#2b3a42] rounded-2xl py-3 px-4 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-wider text-white transition active:translate-y-0.5"
          >
            <div className="w-5 h-5 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-xs font-black">
              f
            </div>
            <span>FACEBOOK</span>
          </button>
        </div>

        {/* Disclaimer / Policies */}
        <p className="text-[11px] font-bold text-gray-500 text-center mt-6 leading-tight">
          By signing in to Duolingo, you agree to our{' '}
          <span className="text-gray-400 underline cursor-pointer">Terms</span> and{' '}
          <span className="text-gray-400 underline cursor-pointer">Privacy Policy</span>.
        </p>

        {/* Link to Sign Up */}
        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              onClick={() => sound.playClick()}
              className="text-[#1cb0f6] font-black uppercase tracking-wider hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </main>

      {/* Footer / Empty spacing for vertical alignment */}
      <footer className="text-center py-4"></footer>
    </div>
  );
}
