import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/laboratorio/sync
 * Sincroniza metadatos de actividad del Laboratorio de Contenido Inclusivo.
 * Se usa para medir el impacto institucional sin almacenar archivos pesados.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      participantId, 
      videoSourceUrl, 
      clipDurationSec, 
      platform, 
      actionType,
      metadata 
    } = body;

    const activity = await prisma.labActivity.create({
      data: {
        participantId: participantId || null,
        videoSourceUrl,
        clipDurationSec,
        platform,
        actionType,
        metadata
      }
    });

    return NextResponse.json({ 
      success: true, 
      id: activity.id 
    });

  } catch (error) {
    console.error('Error syncing lab activity:', error);
    return NextResponse.json(
      { success: false, error: 'Fallo al sincronizar métricas' },
      { status: 500 }
    );
  }
}
