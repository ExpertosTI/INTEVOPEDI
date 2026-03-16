'use client';

import { useState } from 'react';
import { requestParticipantAccessCode, participantAccessLogin } from '@/app/actions';

export function ParticipantLoginForm({ defaultEmail = '', defaultCode = '' }) {
  // If defaultEmail is provided (e.g. from registration), we can jump to step 2 if we also have a code, or just pre-fill email.
  const [step, setStep] = useState(defaultEmail && !defaultCode ? 2 : 1);
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  async function handleRequestCode(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const result = await requestParticipantAccessCode(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setEmail(formData.get('email'));
      setStep(2);
      setSuccessMsg(`Te hemos enviado un código de acceso a: ${formData.get('email')}`);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="verify-box">
      {error && <div className="banner banner-error" role="alert">{error}</div>}
      {successMsg && <div className="banner banner-success" role="status">{successMsg}</div>}

      {step === 1 ? (
        <form onSubmit={handleRequestCode} className="stack">
          <label>
            Correo electrónico
            <input 
              type="email" 
              name="email" 
              autoComplete="email" 
              inputMode="email" 
              placeholder="nombre@correo.com" 
              required 
              disabled={isLoading}
              defaultValue={email}
            />
          </label>
          <button type="submit" className="button button-primary" disabled={isLoading}>
            {isLoading ? 'Enviando código...' : 'Recibir código de acceso'}
          </button>
        </form>
      ) : (
        <form action={participantAccessLogin} className="stack">
          {/* We pass email as a hidden field so the original action still works */}
          <input type="hidden" name="email" value={email} />
          
          <label>
            Código de acceso recibido
            <input 
              type="text" 
              name="referenceCode" 
              autoCapitalize="characters" 
              autoComplete="off" 
              placeholder="Ej. INT-AB12CD34" 
              required 
              defaultValue={defaultCode}
            />
          </label>
          <div className="inline-actions">
            <button type="submit" className="button button-primary">
              Entrar al campus
            </button>
            <button 
              type="button" 
              className="button button-secondary"
              onClick={() => {
                setStep(1);
                setSuccessMsg('');
                setError(null);
              }}
            >
              Volver
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
