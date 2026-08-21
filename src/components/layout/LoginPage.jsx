import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebase';

export function LoginPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (signInError) {
      if (signInError.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in was not completed. Please try again.');
      }
      setIsSigningIn(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand" aria-hidden="true">
          <span className="logo-dot" />
          <span className="logo-ring" />
        </div>
        <p className="login-kicker">Private Workspace</p>
        <h1 id="login-title">Your work, in one calm place.</h1>
        <p className="login-copy">
          Sign in to access your projects, credentials, documents, and daily operations.
        </p>

        <button
          className="google-sign-in"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
        >
          <span className="google-mark" aria-hidden="true">G</span>
          {isSigningIn ? 'Connecting...' : 'Continue with Google'}
        </button>

        {error && <p className="login-error" role="alert">{error}</p>}
        <p className="login-note">Only your Google account is used to identify you.</p>
      </section>
    </main>
  );
}