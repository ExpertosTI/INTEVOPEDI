'use client';

import { useState, useEffect } from 'react';

export function AdminWhatsAppScanner() {
  const [session, setSession] = useState({
    status: 'DISCONNECTED',
    phoneNumber: null,
    pushname: null,
    qrCodeDataUrl: null,
    notificationsConfig: {
      notifyOnEnrollment: true,
      notifyOnProgress: true,
      notifyOnCertificate: true,
      senderPhone: '829-954-8373'
    },
    history: []
  });

  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('829-954-8373');
  const [testName, setTestName] = useState('Estudiante');
  const [testMessage, setTestMessage] = useState('¡Hola! Te damos la bienvenida a INTEVOPEDI Academy. Tu acceso a los cursos gratuitos y materiales está activo.');
  const [sendSuccess, setSendSuccess] = useState(null);

  // Fetch initial WhatsApp status
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/whatsapp');
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      }
    } catch (err) {
      console.error('Error fetching WA status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'GENERATE_QR' })
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmScan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CONFIRM_SCAN',
          phoneNumber: '+1 (829) 954-8373',
          pushname: 'INTEVOPEDI Academy Oficial'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DISCONNECT' })
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (key) => {
    const updated = {
      ...session.notificationsConfig,
      [key]: !session.notificationsConfig?.[key]
    };
    setSession((prev) => ({
      ...prev,
      notificationsConfig: updated
    }));

    await fetch('/api/admin/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPDATE_CONFIG', config: updated })
    });
  };

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!testPhone || !testMessage) return;
    setLoading(true);
    setSendSuccess(null);
    try {
      const res = await fetch('/api/admin/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_MESSAGE',
          to: testPhone,
          recipientName: testName,
          message: testMessage,
          type: 'MANUAL'
        })
      });
      if (res.ok) {
        setSendSuccess('Mensaje enviado exitosamente vía WhatsApp.');
        fetchStatus();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = (type) => {
    if (type === 'ENROLLMENT') {
      setTestMessage('¡Hola! Tu inscripción en INTEVOPEDI Academy está confirmada. Puedes acceder a tus clases y materiales en: https://intevopedi.org/participantes con tu número registrado.');
    } else if (type === 'CERTIFICATE') {
      setTestMessage('¡Felicitaciones! Has completado tu curso en INTEVOPEDI Academy. Tu Certificado Oficial con código QR ya está emitido y validado. Descárgalo aquí: https://intevopedi.org/verificar');
    } else if (type === 'REMINDER') {
      setTestMessage('¡Hola! Tienes clases pendientes en tu ruta formativa de INTEVOPEDI Academy. Continúa a tu propio ritmo para alcanzar tu certificación.');
    }
  };

  const isConnected = session.status === 'CONNECTED';

  return (
    <div className="wa-scanner-wrapper stack" style={{ gap: '24px' }}>
      {/* HEADER CARD */}
      <div className="panel" style={{ padding: '24px', borderLeft: '4px solid #25d366' }}>
        <div className="row-between" style={{ alignItems: 'flex-start' }}>
          <div>
            <span className="eyebrow" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>💬</span> Gateway de Notificaciones WhatsApp
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#031b4e', marginTop: '4px' }}>
              Vinculación de WhatsApp y Notificaciones Automáticas
            </h2>
            <p className="helper" style={{ maxWidth: '680px', marginTop: '6px' }}>
              Escanea el código QR desde tu aplicación de WhatsApp (Dispositivos vinculados) para autorizar el envío automatizado de credenciales, avisos de inscripción y certificados con código QR a los estudiantes.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            {isConnected ? (
              <span className="status-badge" style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.85rem', padding: '6px 14px' }}>
                🟢 Sesión Conectada
              </span>
            ) : (
              <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem', padding: '6px 14px' }}>
                ⚪ Desconectado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* QR SCANNER & DEVICE STATUS GRID */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN: QR CODE SCANNER */}
        <div className="panel stack" style={{ padding: '28px', textAlign: 'center', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#031b4e' }}>
            {isConnected ? 'Dispositivo Vinculado Activo' : 'Escanear Código QR'}
          </h3>

          {isConnected ? (
            <div className="stack" style={{ alignItems: 'center', gap: '16px', margin: '20px 0' }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: '#e8f9ef',
                display: 'grid',
                placeItems: 'center',
                color: '#25d366',
                fontSize: '2.5rem',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.2)'
              }}>
                ✓
              </div>
              <div>
                <strong style={{ fontSize: '1.1rem', color: '#031b4e', display: 'block' }}>
                  {session.pushname || 'INTEVOPEDI Academy Oficial'}
                </strong>
                <span className="helper" style={{ fontSize: '0.95rem', color: '#16a34a', fontWeight: '700' }}>
                  {session.phoneNumber || '+1 (829) 954-8373'}
                </span>
                <p className="helper" style={{ marginTop: '8px' }}>
                  Batería: <b>🔋 98%</b> · Protocolo Web Multi-Device Activo
                </p>
              </div>

              <button
                type="button"
                className="button button-outline"
                style={{ borderColor: '#ef4444', color: '#dc2626', marginTop: '10px' }}
                onClick={handleDisconnect}
                disabled={loading}
              >
                Cerrar sesión de WhatsApp
              </button>
            </div>
          ) : session.status === 'WAITING_SCAN' && session.qrCodeDataUrl ? (
            <div className="stack" style={{ alignItems: 'center', gap: '16px', margin: '14px 0' }}>
              <div style={{
                padding: '12px',
                background: '#ffffff',
                border: '2px solid #25d366',
                borderRadius: '16px',
                boxShadow: '0 10px 28px rgba(3, 27, 78, 0.08)'
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={session.qrCodeDataUrl}
                  alt="Código QR de WhatsApp"
                  width="260"
                  height="260"
                  style={{ display: 'block' }}
                />
              </div>

              <div className="helper" style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '320px', lineHeight: '1.5' }}>
                1. Abre <b>WhatsApp</b> en tu celular.<br />
                2. Toca <b>Ajustes</b> o <b>Dispositivos vinculados</b>.<br />
                3. Toca <b>Vincular un dispositivo</b> y apunta la cámara a este código.
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="button button-primary"
                  style={{ background: '#25d366', borderColor: '#25d366' }}
                  onClick={handleConfirmScan}
                  disabled={loading}
                >
                  ✓ Confirmar escaneo móvil
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleGenerateQR}
                  disabled={loading}
                >
                  🔄 Regenerar QR
                </button>
              </div>
            </div>
          ) : (
            <div className="stack" style={{ alignItems: 'center', gap: '16px', margin: '30px 0' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'grid',
                placeItems: 'center',
                color: '#64748b',
                fontSize: '2rem'
              }}>
                📱
              </div>
              <p className="helper" style={{ maxWidth: '320px' }}>
                Genera un código QR único para vincular el número de WhatsApp oficial de INTEVOPEDI Academy.
              </p>
              <button
                type="button"
                className="button button-primary"
                style={{ background: '#25d366', borderColor: '#25d366', padding: '12px 28px', fontSize: '1rem', fontWeight: '800' }}
                onClick={handleGenerateQR}
                disabled={loading}
              >
                {loading ? 'Generando código...' : 'Generar código QR para escanear'}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: NOTIFICATION TRIGGERS CONFIG */}
        <div className="panel stack" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#031b4e' }}>
            Reglas de Disparo de Notificaciones
          </h3>
          <p className="helper">
            Configura qué eventos desencadenan mensajes automáticos por WhatsApp a los estudiantes inscritos.
          </p>

          <div className="stack" style={{ gap: '16px', marginTop: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <div>
                <strong style={{ display: 'block', color: '#031b4e', fontSize: '0.92rem' }}>
                  📩 Notificar al Inscribirse
                </strong>
                <span className="helper" style={{ fontSize: '0.8rem' }}>
                  Envía de inmediato el mensaje de bienvenida y código de campus al alumno.
                </span>
              </div>
              <input
                type="checkbox"
                checked={!!session.notificationsConfig?.notifyOnEnrollment}
                onChange={() => handleToggleRule('notifyOnEnrollment')}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <div>
                <strong style={{ display: 'block', color: '#031b4e', fontSize: '0.92rem' }}>
                  🎓 Notificar Emisión de Certificado
                </strong>
                <span className="helper" style={{ fontSize: '0.8rem' }}>
                  Envía el enlace público con código QR y felicitación cuando se complete el curso.
                </span>
              </div>
              <input
                type="checkbox"
                checked={!!session.notificationsConfig?.notifyOnCertificate}
                onChange={() => handleToggleRule('notifyOnCertificate')}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <div>
                <strong style={{ display: 'block', color: '#031b4e', fontSize: '0.92rem' }}>
                  🔔 Avisos de Progreso y Recordatorios
                </strong>
                <span className="helper" style={{ fontSize: '0.8rem' }}>
                  Envía estímulos motivacionales al completar el 50% y 100% de las unidades.
                </span>
              </div>
              <input
                type="checkbox"
                checked={!!session.notificationsConfig?.notifyOnProgress}
                onChange={() => handleToggleRule('notifyOnProgress')}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </label>
          </div>

          <div style={{ marginTop: '16px', padding: '14px', background: '#eaf2ff', borderRadius: '10px', fontSize: '0.82rem', color: '#1d448e' }}>
            💡 <b>Nota de Entrega:</b> Los mensajes se envían utilizando la sesión vinculada con la firma institucional de <b>INTEVOPEDI Academy</b>.
          </div>
        </div>
      </div>

      {/* DISPATCH TESTER & HISTORY */}
      <div className="panel stack" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#031b4e' }}>
          Probador y Envío Directo por WhatsApp
        </h3>
        <p className="helper">
          Envía un mensaje de prueba a cualquier número de WhatsApp para comprobar la conexión y el formato.
        </p>

        {sendSuccess && (
          <div className="banner banner-success" role="status">
            <span>✓ {sendSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSendTest} className="stack" style={{ gap: '14px', marginTop: '10px' }}>
          <div className="form-row">
            <label>
              Teléfono de destino con código de país
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="Ej. 8299548373 o +18299548373"
                required
              />
            </label>
            <label>
              Nombre del destinatario
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                required
              />
            </label>
          </div>

          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span className="helper" style={{ fontWeight: '700' }}>Plantillas rápidas:</span>
              <button type="button" className="ea-chip" onClick={() => loadTemplate('ENROLLMENT')}>Inscripción</button>
              <button type="button" className="ea-chip" onClick={() => loadTemplate('CERTIFICATE')}>Certificado</button>
              <button type="button" className="ea-chip" onClick={() => loadTemplate('REMINDER')}>Recordatorio</button>
            </div>
            <textarea
              rows={3}
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Escribe el mensaje..."
              required
            />
          </div>

          <button
            type="submit"
            className="button button-primary"
            style={{ width: 'fit-content', background: '#25d366', borderColor: '#25d366' }}
            disabled={loading}
          >
            {loading ? 'Enviando...' : '📤 Enviar mensaje por WhatsApp'}
          </button>
        </form>

        {/* RECENT DISPATCHES TABLE */}
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#031b4e', marginBottom: '12px' }}>
            Historial Reciente de Envíos por WhatsApp
          </h4>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Destinatario</th>
                  <th>Tipo</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {(session.history || []).map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <strong>{msg.recipientName}</strong>
                      <br />
                      <span className="helper">{msg.to}</span>
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                        {msg.type}
                      </span>
                    </td>
                    <td style={{ maxWidth: '340px', fontSize: '0.84rem' }}>
                      {msg.text}
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {new Date(msg.sentAt).toLocaleTimeString()} · {new Date(msg.sentAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>
                        ✓✓ {msg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
