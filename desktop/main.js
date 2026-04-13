const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const { create } = require('youtube-dl-exec');

// Protocol for local video serving
const VIDEO_PROTOCOL = 'lci-video';

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

    // 2. Mock de respuesta (En el futuro esto llamará a OpenAI Whisper)
    const mockTranscript = [
      { word: "Bienvenidos", start: 0.5, end: 1.2 },
      { word: "al", start: 1.3, end: 1.5 },
      { word: "concierto", start: 1.6, end: 2.5 },
      { word: "del", start: 2.6, end: 2.8 },
      { word: "Grupo", start: 2.9, end: 3.5 },
      { word: "Atrévete.", start: 3.6, end: 4.5 }
    ];

    return { success: true, transcript: mockTranscript };

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

    // 2. Mock de descripción por IA (En producción esto llamaría a Gemini Vision o GPT-4o)
    // El sistema analizaría el framePath y devolvería una descripción.
    const mockDescription = "En este momento del video, el cantante del Grupo Atrévete está sonriendo mientras toca la guitarra frente a un público animado. La iluminación es cálida y se ve mucho movimiento en el escenario.";

    return { 
      success: true, 
      description: mockDescription,
      framePath 
    };

  } catch (error) {
    return { success: false, error: error.message };
  }
});
