/**
 * Laboratorio de Contenido Inclusivo (LCI) - Desktop App
 * Desarrollado por: Adderly Marte (RENACE.TECH)
 * Donado a: INTEVOPEDI - Instituto de Tecnología Inclusiva para Ciegos
 * 
 * Esta aplicación permite a usuarios con discapacidad visual crear
 * contenido vertical accesible a partir de videos de YouTube.
 */

require('dotenv').config();

const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const { create } = require('youtube-dl-exec');
const fs = require('fs');

// Protocol for local video serving
const VIDEO_PROTOCOL = 'lci-video';

// Configuración de APIs - cargar desde variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    title: 'Laboratorio de Contenido Inclusivo | INTEVOPEDI'
  });

  // In production, we would load the exported Next.js files
  // In development, we load the dev server
  const startUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../out/index.html')}`;

  win.loadURL(startUrl);
}

// Register custom protocol to allow local video playback without webSecurity issues
app.whenReady().then(() => {
  protocol.handle(VIDEO_PROTOCOL, (request) => {
    const filePath = request.url.replace(`${VIDEO_PROTOCOL}://`, '');
    return net.fetch(`file://${filePath}`);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- IPC Handlers for Video Processing ---

ipcMain.handle('video:download', async (event, url) => {
  const downloadPath = path.join(app.getPath('downloads'), 'LCI_Temp');
  if (!require('fs').existsSync(downloadPath)) {
    require('fs').mkdirSync(downloadPath);
  }

  const filename = `stream_${Date.now()}.mp4`;
  const fullPath = path.join(downloadPath, filename);

  try {
    // Usamos spawn para tener control sobre el progreso en tiempo real
    const process = spawn('npx', ['youtube-dl-exec', url, '-o', fullPath, '--format', 'mp4']);

    process.stdout.on('data', (data) => {
      event.sender.send('video:progress', { type: 'download', data: data.toString() });
    });

    return new Promise((resolve, reject) => {
      process.on('close', (code) => {
        if (code === 0) resolve({ success: true, path: fullPath });
        else reject(new Error(`Download failed with code ${code}`));
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('video:clip', async (event, { inputPath, start, end }) => {
  const outputPath = inputPath.replace('.mp4', `_short_${Date.now()}.mp4`);
  
  // Argumentos de FFmpeg: Recorte vertical 9:16 y escala a 720p
  const ffmpegArgs = [
    '-ss', start,
    '-to', end,
    '-i', inputPath,
    '-vf', 'crop=ih*(9/16):ih,scale=720:1280', 
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-c:a', 'aac',
    '-y',
    outputPath
  ];

  const process = spawn(ffmpeg, ffmpegArgs);

  process.stderr.on('data', (data) => {
    event.sender.send('video:progress', { type: 'clipping', data: data.toString() });
  });

  return new Promise((resolve, reject) => {
    process.on('close', (code) => {
      if (code === 0) resolve({ success: true, outputPath });
      else reject(new Error(`Clipping failed with code ${code}`));
    });
  });
});

ipcMain.handle('video:transcribe', async (event, videoPath) => {
  const audioPath = videoPath.replace('.mp4', '.mp3');
  
  try {
    // 1. Extraer audio localmente usando FFmpeg
    const extractAudio = spawn(ffmpeg, [
      '-i', videoPath,
      '-vn',
      '-acodec', 'libmp3lame',
      '-ab', '128k',
      '-ar', '44100',
      '-y',
      audioPath
    ]);

    await new Promise((resolve, reject) => {
      extractAudio.on('close', (code) => code === 0 ? resolve() : reject());
    });

    // 2. Transcripción con OpenAI Whisper
    if (!OPENAI_API_KEY) {
      return { success: false, error: 'API key no configurada. Configure OPENAI_API_KEY.' };
    }
    
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(audioPath));
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');
      formData.append('timestamp_granularities', ['word']);
      
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convertir formato de Whisper al formato esperado
      const transcript = data.words ? data.words.map(w => ({
        word: w.word.trim(),
        start: w.start,
        end: w.end
      })) : [];
      
      return { success: true, transcript };
    } catch (error) {
      console.error('Transcription error:', error);
      return { success: false, error: `Transcripción fallida: ${error.message}` };
    }

  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('video:describe', async (event, { videoPath, timestamp }) => {
  try {
    const framePath = videoPath.replace('.mp4', `_frame_${timestamp}.jpg`);
    
    // 1. Extraer un fotograma específico usando FFmpeg
    await new Promise((resolve, reject) => {
      spawn(ffmpeg, [
        '-ss', timestamp,
        '-i', videoPath,
        '-vframes', '1',
        '-q:v', '2',
        '-y',
        framePath
      ]).on('close', resolve).on('error', reject);
    });

    // 2. Análisis visual con Gemini Vision
    if (!GEMINI_API_KEY) {
      return { success: false, error: 'API key no configurada. Configure GEMINI_API_KEY.' };
    }
    
    try {
      const imageData = fs.readFileSync(framePath, { encoding: 'base64' });
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: 'Describe esta imagen de un video para una persona con discapacidad visual. Sé conciso y enfócate en los elementos visuales principales.' },
              { inline_data: { mime_type: 'image/jpeg', data: imageData } }
            ]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      const description = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar descripción';
      
      return { 
        success: true, 
        description,
        framePath 
      };
    } catch (error) {
      console.error('Description error:', error);
      return { success: false, error: `Análisis visual fallido: ${error.message}` };
    }

  } catch (error) {
    return { success: false, error: error.message };
  }
});
