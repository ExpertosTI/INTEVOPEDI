'use client';

import { useEffect, useState } from 'react';
import {
  requestParticipantAccessCode,
  participantAccessLogin,
  registerParticipantAccount,
  resendParticipantVerification,
  participantPasswordLogin
} from '@/app/actions';

const MODES = {
  REGISTER: 'register',
  LOGIN: 'login',
  CODE: 'code'
};

function getPasswordStrength(password) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
}

const strengthLabels = {
  weak: 'Débil',
  medium: 'Media',
  strong: 'Fuerte'
};

export function ParticipantLoginForm({ defaultEmail = '', defaultCode = '' }) {
  const [mode, setMode] = useState(defaultCode ? MODES.CODE : MODES.REGISTER);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [referenceCode, setReferenceCode] = useState(defaultCode);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = mode === MODES.REGISTER ? getPasswordStrength(password) : null;

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
    if (defaultCode) setReferenceCode(defaultCode);
  }, [defaultEmail, defaultCode]);

  function resetFeedback() {
    setMessage('');
    setError('');
  }

  async function handleRegister(e) {
    e.preventDefault();
    resetFeedback();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const res = await registerParticipantAccount(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setMessage(`Cuenta creada. Revisa tu correo (${res.email}) para verificar en las próximas 72 horas.`);
      setMode(MODES.LOGIN);
    }
    setIsLoading(false);
  }

  async function handleResend(e) {
    e.preventDefault();
    resetFeedback();
    setIsLoading(true);
    const formData = new FormData();
    formData.set('email', email);
    const res = await resendParticipantVerification(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setMessage('Te enviamos un nuevo enlace de verificación. Revisa tu correo.');
    }
    setIsLoading(false);
  }

  async function handlePasswordLogin(e) {
    e.preventDefault();
    resetFeedback();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const res = await participantPasswordLogin(formData);
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    }
    // on success it redirects
  }

  async function handleRequestCode(e) {
    e.preventDefault();
    resetFeedback();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const result = await requestParticipantAccessCode(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setEmail(formData.get('email'));
      setMessage(`Te enviamos un código a ${formData.get('email')}. Úsalo en el campo siguiente.`);
      setMode(MODES.CODE);
    }
    setIsLoading(false);
  }

  return (
    <div className="verify-box">
      <div className="tab-row" role="tablist" aria-label="Opciones de acceso">
        <button
          type="button"
          role="tab"
          aria-selected={mode === MODES.REGISTER}
          className={`tab ${mode === MODES.REGISTER ? 'active' : ''}`}
          onClick={() => { setMode(MODES.REGISTER); resetFeedback(); }}
        >
          Crear cuenta
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === MODES.LOGIN}
          className={`tab ${mode === MODES.LOGIN ? 'active' : ''}`}
          onClick={() => { setMode(MODES.LOGIN); resetFeedback(); }}
        >
          Entrar con contraseña
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === MODES.CODE}
          className={`tab ${mode === MODES.CODE ? 'active' : ''}`}
          onClick={() => { setMode(MODES.CODE); resetFeedback(); }}
        >
          Usar código
        </button>
      </div>

      {error ? <div className="banner banner-error" role="alert">{error}</div> : null}
      {message ? <div className="banner banner-success" role="status">{message}</div> : null}

      {mode === MODES.REGISTER && (
        <form onSubmit={handleRegister} className="stack" aria-label="Crear cuenta">
          <p className="helper">Solo necesitas correo y una contraseña. Luego verifica el enlace que enviaremos (72 horas de validez).</p>
          <label>
            Nombre (opcional)
            <input
              type="text"
              name="fullName"
              placeholder="Tu nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
          </label>
          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="nombre@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </label>
          <label>
            Contraseña
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </label>
          {passwordStrength ? (
            <div className="password-strength">
              <div className="password-strength-bar">
                <div className={`password-strength-fill ${passwordStrength}`} />
              </div>
              <span className={`password-strength-label ${passwordStrength}`}>
                Seguridad: {strengthLabels[passwordStrength]}
              </span>
            </div>
          ) : null}
          <button type="submit" className="button button-primary" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? 'Creando...' : 'Crear y enviar verificación'}
          </button>
        </form>
      )}

      {mode === MODES.LOGIN && (
        <form onSubmit={handlePasswordLogin} className="stack" aria-label="Entrar con correo y contraseña">
          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="nombre@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </label>
          <label>
            Contraseña
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Tu contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </label>
          <div className="inline-actions">
            <button type="submit" className="button button-primary" disabled={isLoading} aria-busy={isLoading}>
              {isLoading ? 'Ingresando...' : 'Entrar'}
            </button>
            <button type="button" className="button button-secondary" disabled={isLoading || !email} onClick={handleResend}>
              Reenviar verificación
            </button>
          </div>
        </form>
      )}

      {mode === MODES.CODE && (
        <div className="stack" aria-label="Acceso con código">
          <form onSubmit={handleRequestCode} className="stack">
            <p className="helper">Si ya te inscribiste, te enviamos un código. Úsalo si prefieres este método.</p>
            <label>
              Correo electrónico
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="nombre@correo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </label>
            <button type="submit" className="button button-secondary" disabled={isLoading} aria-busy={isLoading}>
              {isLoading ? 'Enviando código...' : 'Enviar código a mi correo'}
            </button>
          </form>

          <form action={participantAccessLogin} className="stack">
            <input type="hidden" name="email" value={email} />
            <label>
              Código de acceso
              <input
                type="text"
                name="referenceCode"
                autoCapitalize="characters"
                autoComplete="one-time-code"
                placeholder="Ej. INT-AB12CD34"
                required
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
              />
            </label>
            <div className="inline-actions">
              <button type="submit" className="button button-primary">
                Entrar con código
              </button>
              <button
                type="button"
                className="button button-ghost"
                onClick={() => { setReferenceCode(''); resetFeedback(); }}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
