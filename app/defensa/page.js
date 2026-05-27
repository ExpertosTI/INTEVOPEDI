'use client';

import { useState } from 'react';
import { registerSelfDefense } from '../actions';
import Link from 'next/link';

export default function DefensaPage() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    const formData = new FormData(e.target);
    const result = await registerSelfDefense(formData);
    
    if (result?.error) {
      setMessage(result.error);
      setStatus('error');
    } else {
      setStatus('success');
    }
  }

  return (
    <main className="section center-page" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="shell narrow-panel" style={{ width: '100%', maxWidth: '600px', animation: 'fadeIn 0.5s ease-out' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="eyebrow theme-access" style={{ marginBottom: '16px' }}>Defensa Personal</div>
          <h1>Taller de Defensa Personal</h1>
          <p style={{ marginTop: '12px', fontSize: '1.1rem' }}>
            Aprende técnicas básicas y efectivas de defensa personal adaptadas para personas con discapacidad. 
            Déjanos tus datos para organizar los grupos y horarios.
          </p>
        </div>

        {status === 'success' ? (
          <div className="panel" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🥋</div>
            <h2>¡Registro Exitoso!</h2>
            <p style={{ marginTop: '16px', marginBottom: '32px' }}>
              Gracias por tu interés. Hemos guardado tus datos y te contactaremos pronto para confirmar los grupos y horarios disponibles.
            </p>
            <Link href="/" className="button button-primary">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="panel" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            }}></div>
            
            <form onSubmit={handleSubmit} className="stack" style={{ gap: '24px' }}>
              {status === 'error' && (
                <div className="banner-error" style={{ padding: '12px 16px', borderRadius: '8px', color: 'var(--accent-red)', fontWeight: '500', fontSize: '0.9rem' }}>
                  {message}
                </div>
              )}

              <div className="stack" style={{ gap: '8px' }}>
                <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Nombre Completo <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                <input 
                  type="text" 
                  name="fullName" 
                  required 
                  placeholder="Tu nombre y apellidos"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-muted)', fontSize: '1rem' }}
                />
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="stack" style={{ gap: '8px' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Teléfono / WhatsApp <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    placeholder="Ej. 8090000000"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-muted)', fontSize: '1rem' }}
                  />
                </div>
                <div className="stack" style={{ gap: '8px' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Opcional"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-muted)', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <div className="stack" style={{ gap: '8px' }}>
                <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Tipo de Discapacidad / Requerimientos de Accesibilidad</label>
                <input 
                  type="text" 
                  name="disabilityType" 
                  placeholder="Ej. Discapacidad visual, motora, etc."
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-muted)', fontSize: '1rem' }}
                />
              </div>

              <div className="stack" style={{ gap: '8px' }}>
                <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Horario Preferido <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                <select 
                  name="schedule" 
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-muted)', fontSize: '1rem', cursor: 'pointer' }}
                >
                  <option value="">Selecciona un horario</option>
                  <option value="MORNING">Mañana (9:00 AM - 12:00 PM)</option>
                  <option value="AFTERNOON">Tarde (2:00 PM - 5:00 PM)</option>
                </select>
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', background: 'var(--bg-muted)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <input 
                  type="checkbox" 
                  name="wantsToReceive" 
                  defaultChecked 
                  style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '4px' }}>Confirmar Interés</strong>
                  Sí, quiero recibir esta capacitación y me comprometo a asistir si se abre el grupo en mi horario seleccionado.
                </span>
              </label>

              <button 
                type="submit" 
                className="button button-primary" 
                disabled={status === 'loading'}
                style={{ width: '100%', height: '52px', fontSize: '1.05rem', marginTop: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff', borderRadius: '12px', fontWeight: 'bold' }}
              >
                {status === 'loading' ? 'Guardando registro...' : 'Registrarme en el Taller'}
              </button>
            </form>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </main>
  );
}
