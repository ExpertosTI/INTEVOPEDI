import QRCode from 'qrcode';

// In-memory or persisted WhatsApp session state
let waSession = {
  status: 'DISCONNECTED', // 'DISCONNECTED' | 'GENERATING_QR' | 'WAITING_SCAN' | 'CONNECTED'
  phoneNumber: null,
  pushname: null,
  qrCodeDataUrl: null,
  connectedAt: null,
  batteryLevel: 98,
  notificationsConfig: {
    notifyOnEnrollment: true,
    notifyOnProgress: true,
    notifyOnCertificate: true,
    senderPhone: '829-954-8373'
  },
  history: [
    {
      id: 'wa-msg-1',
      to: '829-954-8373',
      recipientName: 'Castelli Florencia',
      type: 'ENROLLMENT',
      text: '¡Hola Castelli! Bienvenida a INTEVOPEDI Academy. Tu inscripción al curso de IA y Accesibilidad Digital Aplicada está confirmada. Código de campus: IA-8492. Ingresa en: https://intevopedi.org/mi-inscripcion/IA-8492',
      sentAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'READ'
    },
    {
      id: 'wa-msg-2',
      to: '809-555-1234',
      recipientName: 'Daniel Méndez',
      type: 'CERTIFICATE',
      text: '¡Felicitaciones Daniel! Has completado el curso de IA y Accesibilidad Digital con éxito. Tu Certificado Oficial #CUR_IA_9921 ya está disponible: https://intevopedi.org/certificados/CUR_IA_9921',
      sentAt: new Date(Date.now() - 7200000).toISOString(),
      status: 'DELIVERED'
    }
  ]
};

export async function getWhatsAppStatus() {
  return waSession;
}

export async function generateWhatsAppQR() {
  const pairingKey = `intevopedi_wa_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}@whatsapp.net`;
  const qrDataUrl = await QRCode.toDataURL(pairingKey, {
    width: 280,
    margin: 2,
    color: {
      dark: '#031b4e',
      light: '#ffffff'
    }
  });

  waSession = {
    ...waSession,
    status: 'WAITING_SCAN',
    qrCodeDataUrl: qrDataUrl,
    generatedAt: Date.now()
  };

  return waSession;
}

export async function connectWhatsAppSession(phoneNumber = '+1 (829) 954-8373', pushname = 'INTEVOPEDI Academy Oficial') {
  waSession = {
    ...waSession,
    status: 'CONNECTED',
    phoneNumber,
    pushname,
    qrCodeDataUrl: null,
    connectedAt: new Date().toISOString()
  };

  return waSession;
}

export async function disconnectWhatsAppSession() {
  waSession = {
    ...waSession,
    status: 'DISCONNECTED',
    phoneNumber: null,
    pushname: null,
    qrCodeDataUrl: null,
    connectedAt: null
  };

  return waSession;
}

export async function updateNotificationConfig(config) {
  waSession.notificationsConfig = {
    ...waSession.notificationsConfig,
    ...config
  };
  return waSession.notificationsConfig;
}

export async function sendWhatsAppMessage({ to, recipientName, message, type = 'MANUAL' }) {
  const newMsg = {
    id: `wa-msg-${Date.now()}`,
    to,
    recipientName: recipientName || 'Estudiante',
    type,
    text: message,
    sentAt: new Date().toISOString(),
    status: waSession.status === 'CONNECTED' ? 'DELIVERED' : 'PENDING'
  };

  waSession.history.unshift(newMsg);
  if (waSession.history.length > 50) {
    waSession.history.pop();
  }

  return { success: true, message: newMsg };
}
