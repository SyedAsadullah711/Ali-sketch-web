import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide your admin email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email: email.trim(), password });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-studio-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-studio-gold selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-block group">
          <span className="font-serif text-3xl font-bold tracking-tight text-studio-charcoal">
            STROKE &amp; SOUL
          </span>
          <span className="block text-[10px] tracking-[0.28em] text-studio-gold uppercase -mt-1 font-semibold">
            Administrative Management Portal
          </span>
        </Link>
        <p className="text-xs text-studio-taupe">
          Authorized studio personnel only &bull; End-to-end encrypted session
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-studio-card py-8 px-6 sm:px-10 rounded-sm border border-studio-border shadow-elevated">
          
          {error && (
            <div className="mb-6 p-3.5 rounded-sm bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@strokeandsoul.art"
                  className="w-full px-3.5 py-2.5 pl-10 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                />
                <Mail className="w-4 h-4 text-studio-taupe absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                />
                <Lock className="w-4 h-4 text-studio-taupe absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-studio-taupe hover:text-studio-charcoal focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 text-studio-gold rounded border-studio-border focus:ring-studio-gold"
                />
                <span className="text-xs text-studio-taupe">Remember session</span>
              </label>

              <span className="text-[11px] text-studio-taupe flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-studio-gold" />
                256-Bit TLS
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-widest font-bold rounded-sm transition-colors duration-200 flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Access Admin Portal</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-studio-border/60 text-center">
            <Link
              to="/"
              className="text-xs text-studio-taupe hover:text-studio-charcoal transition-colors underline-offset-4 hover:underline"
            >
              &larr; Return to Public Website
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
