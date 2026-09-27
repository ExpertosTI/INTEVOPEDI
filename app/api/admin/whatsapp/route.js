import { NextResponse } from 'next/server';
import {
  getWhatsAppStatus,
  generateWhatsAppQR,
  connectWhatsAppSession,
  disconnectWhatsAppSession,
  updateNotificationConfig,
  sendWhatsAppMessage
} from '@/lib/whatsapp';

export async function GET() {
  try {
    const status = await getWhatsAppStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'GENERATE_QR') {
      const res = await generateWhatsAppQR();
      return NextResponse.json(res);
    }

    if (action === 'CONFIRM_SCAN') {
      const phone = body.phoneNumber || '+1 (829) 954-8373';
      const name = body.pushname || 'INTEVOPEDI Academy Oficial';
      const res = await connectWhatsAppSession(phone, name);
      return NextResponse.json(res);
    }

    if (action === 'DISCONNECT') {
      const res = await disconnectWhatsAppSession();
      return NextResponse.json(res);
    }

    if (action === 'UPDATE_CONFIG') {
      const res = await updateNotificationConfig(body.config || {});
      return NextResponse.json({ success: true, config: res });
    }

    if (action === 'SEND_MESSAGE') {
      const { to, recipientName, message, type } = body;
      if (!to || !message) {
        return NextResponse.json({ error: 'Teléfono y mensaje requeridos' }, { status: 400 });
      }
      const res = await sendWhatsAppMessage({ to, recipientName, message, type });
      return NextResponse.json(res);
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
