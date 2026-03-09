import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let faceLandmarker: FaceLandmarker | null = null;
let isLoadingModels = false;

export const loadFaceModels = async () => {
  if (faceLandmarker || isLoadingModels) return;
  isLoadingModels = true;
  
  try {
    console.log('Starting to load MediaPipe face models...');
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );
    
    // Add a timeout for model creation
    const modelPromise = FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: 'CPU',
      },
      runningMode: 'IMAGE',
      numFaces: 1,
    });

    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('Model loading timeout')), 10000)
    );

    faceLandmarker = await Promise.race([modelPromise, timeoutPromise]) as FaceLandmarker;
    console.log('MediaPipe Face Landmarker loaded successfully');
  } catch (error) {
    console.error('Error loading MediaPipe face models:', error);
    faceLandmarker = null;
  } finally {
    isLoadingModels = false;
  }
};

export const extractFace = async (imageSrc: string): Promise<string | null> => {
  // Start loading models if not already loaded, but don't wait forever
  const loadPromise = loadFaceModels();
  
  const img = new Image();
  img.src = imageSrc;
  await new Promise((resolve) => (img.onload = resolve));

  let cropX = 0, cropY = 0, finalWidth = img.width, finalHeight = img.height;
  let detected = false;

  // Wait a short time for models if they are loading, otherwise skip and use fallback
  if (isLoadingModels) {
    await Promise.race([loadPromise, new Promise(resolve => setTimeout(resolve, 3000))]);
  }

  if (faceLandmarker) {
    try {
      const results = faceLandmarker.detect(img);
      if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        let minX = 1, minY = 1, maxX = 0, maxY = 0;
        landmarks.forEach(point => {
          minX = Math.min(minX, point.x);
          minY = Math.min(minY, point.y);
          maxX = Math.max(maxX, point.x);
          maxY = Math.max(maxY, point.y);
        });

        const pixelX = minX * img.width;
        const pixelY = minY * img.height;
        const pixelWidth = (maxX - minX) * img.width;
        const pixelHeight = (maxY - minY) * img.height;

        const padding = 0.1;
        const side = Math.max(pixelWidth, pixelHeight) * (1 + padding * 2);
        
        cropX = Math.max(0, (pixelX + pixelWidth / 2) - side / 2);
        cropY = Math.max(0, (pixelY + pixelHeight / 2) - side / 2);
        finalWidth = Math.min(side, img.width - cropX);
        finalHeight = Math.min(side, img.height - cropY);
        
        const minSide = Math.min(finalWidth, finalHeight);
        finalWidth = minSide;
        finalHeight = minSide;
        detected = true;
        console.log('Face detected and cropped');
      }
    } catch (err) {
      console.error('Detection error:', err);
    }
  }

  if (!detected) {
    console.log('Falling back to center crop');
    const size = Math.min(img.width, img.height);
    cropX = (img.width - size) / 2;
    cropY = (img.height - size) / 2;
    finalWidth = size;
    finalHeight = size;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = 800;
  canvas.height = 800;

  ctx.beginPath();
  ctx.arc(400, 400, 400, 0, Math.PI * 2);
  ctx.clip();

  ctx.drawImage(img, cropX, cropY, finalWidth, finalHeight, 0, 0, 800, 800);

  return canvas.toDataURL('image/png');
};
