import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, RotateCcw, Check } from 'lucide-react';

interface PhotoCaptureProps {
  onPhotoConfirmed: (photoBase64: string) => void;
}

export default function PhotoCapture({ onPhotoConfirmed }: PhotoCaptureProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(photoDataUrl);
        
        // Stop camera
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCapturing(false);
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (photo) {
      // Convert to base64 without data URL prefix
      const base64 = photo.split(',')[1];
      onPhotoConfirmed(base64);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-optical-dark">
          <Camera className="h-5 w-5" />
          Take Your Photo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-square bg-optical-light rounded-lg overflow-hidden">
          {!photo && !isCapturing && (
            <div className="flex items-center justify-center h-full">
              <Button onClick={startCamera} size="lg" className="bg-optical-blue hover:bg-optical-blue/90">
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            </div>
          )}
          
          {isCapturing && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Button onClick={capturePhoto} size="lg" className="bg-optical-blue hover:bg-optical-blue/90">
                  Capture
                </Button>
              </div>
            </>
          )}
          
          {photo && (
            <img
              src={photo}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {photo && (
          <div className="flex gap-2">
            <Button
              onClick={retakePhoto}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button
              onClick={confirmPhoto}
              className="flex-1 bg-optical-accent hover:bg-optical-accent/90"
            >
              <Check className="mr-2 h-4 w-4" />
              Confirm
            </Button>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}