'use client';

import { useState } from 'react';
import { studentIdentifierCheck, studentFirstTimeSetPassword, studentPasswordLogin } from '@/app/actions';

export function ParticipantLoginFlow({ defaultEmail, defaultCode }) {
  const [step, setStep] = useState('identifier'); // identifier | login | first_time
  const [identifier, setIdentifier] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleIdentifierSubmit(e) {
    e.preventDefault();
    if (!identifier || identifier.length < 8) {
      setError('Ingresa una cédula o teléfono válido.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.target);
    const result = await studentIdentifierCheck(formData);
    
    if (result.error) {
      setError(result.error);
    } else if (result.status === 'not_found') {
      setError('No encontramos ninguna inscripción con ese dato. Verifica con tu administrador o facilitador.');
    } else if (result.status === 'first_time') {
      setParticipantName(result.participantName);
      setStep('first_time');
    } else if (result.status === 'login') {
      setStep('login');
    }
    
    setLoading(false);
  }

  async function handlePasswordLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.target);
    formData.append('identifier', identifier);
    const result = await studentPasswordLogin(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleFirstTimeSetup(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.target);
    formData.append('identifier', identifier);
    const result = await studentFirstTimeSetPassword(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="login-flow-container">
      {error && <div className="banner banner-error">{error}</div>}
      
      {step === 'identifier' && (
        <form onSubmit={handleIdentifierSubmit} className="stack">
          <label>
            Ingresa tu cédula o número de teléfono
            <input 
              type="text" 
              name="identifier" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required 
              placeholder="Ej. 40220649281 o 8092223333" 
              autoFocus
            />
          </label>
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Verificando...' : 'Continuar'}
          </button>
        </form>
      )}

      {step === 'login' && (
        <form onSubmit={handlePasswordLogin} className="stack">
          <p className="helper">Ingresando como: <strong>{identifier}</strong></p>
          <label>
            Contraseña
            <input 
              type="password" 
              name="password" 
              required 
              placeholder="Ingresa tu contraseña" 
              autoFocus
            />
          </label>
          <div className="row-between">
            <button type="button" onClick={() => setStep('identifier')} className="button button-ghost">
              Volver
            </button>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar a mi campus'}
            </button>
          </div>
        </form>
      )}

      {step === 'first_time' && (
        <form onSubmit={handleFirstTimeSetup} className="stack">
          <div className="banner banner-success">
            ¡Hola {participantName}! Es tu primera vez aquí. Por favor crea una contraseña para asegurar tu cuenta.
          </div>
          <p className="helper">Ingresando como: <strong>{identifier}</strong></p>
          <label>
            Crea una contraseña (mín. 8 caracteres)
            <input 
              type="password" 
              name="password" 
              required 
              minLength={8}
              placeholder="Mínimo 8 caracteres" 
              autoFocus
            />
          </label>
          <label>
            Confirma tu contraseña
            <input 
              type="password" 
              name="confirmPassword" 
              required 
              minLength={8}
              placeholder="Escribe la contraseña otra vez" 
            />
          </label>
          <div className="row-between">
            <button type="button" onClick={() => setStep('identifier')} className="button button-ghost">
              Volver
            </button>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar y Entrar'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
