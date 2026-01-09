'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { identifyPlantFromImage } from '@/ai/flows/identify-plant-from-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, Search, Sparkles, Camera, RefreshCcw, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';

export function PlantIdentifier() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('camera');
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (hasCameraPermission) return; // a camera stream is already active
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support camera access.");
      setHasCameraPermission(false);
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Camera access was denied. Please enable camera permissions in your browser settings.');
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  }, [toast, hasCameraPermission]);

  useEffect(() => {
    if (activeTab === 'camera' && !previewUrl) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeTab, startCamera, stopCamera, previewUrl]);


  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPreviewUrl(dataUri);
        stopCamera();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if(activeTab === 'camera') {
      startCamera();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!previewUrl) {
      setError('Please capture or upload a photo first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const identifiedPlant = await identifyPlantFromImage({
        photoDataUri: previewUrl,
      });
      setResult(identifiedPlant);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Identification Failed',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCameraView = () => (
    <div className="space-y-4">
      <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-dashed bg-secondary">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <Button onClick={handleCapture} disabled={loading || hasCameraPermission !== true} className="w-full">
        <Camera />
        <span>Capture Photo</span>
      </Button>
    </div>
  );

  const renderFileUploadView = () => (
    <div className="space-y-4 flex flex-col items-center justify-center p-8 rounded-lg bg-secondary/30 min-h-[250px]">
        <Upload className="w-12 h-12 text-primary" />
        <p className="text-muted-foreground text-center">Click the button to upload an image from your gallery.</p>
        <Input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            id="file-upload"
        />
        <Button onClick={() => fileInputRef.current?.click()} disabled={loading}>
            Select Image
        </Button>
    </div>
);

  const renderPreview = () => (
    <div className="space-y-4">
      <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-dashed">
        {previewUrl && <Image src={previewUrl} alt="Plant preview" layout="fill" objectFit="contain" />}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={handleRetake} variant="outline" disabled={loading}>
          <RefreshCcw />
          <span>{activeTab === 'camera' ? 'Retake' : 'Clear'}</span>
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          <span>Identify Plant</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={
        (newTab) => {
          setPreviewUrl(null); // Clear preview when switching tabs
          setError(null);
          setResult(null);
          setActiveTab(newTab)
        }} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">
                <Camera className="mr-2" /> Use Camera
            </TabsTrigger>
            <TabsTrigger value="upload">
                <Upload className="mr-2" /> Upload Image
            </TabsTrigger>
        </TabsList>
        <TabsContent value="camera">
            {hasCameraPermission === null && (
                <div className="flex flex-col items-center justify-center space-y-4 text-center p-8 rounded-lg bg-secondary/30 min-h-[250px]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="font-semibold text-primary">Requesting Camera Access...</p>
                </div>
            )}
            {hasCameraPermission === false && !previewUrl && (
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Camera Error</AlertTitle>
                <AlertDescription>{error || 'Could not access the camera. Please check your browser permissions.'}</AlertDescription>
                </Alert>
            )}
            {previewUrl ? renderPreview() : (hasCameraPermission && renderCameraView())}
        </TabsContent>
        <TabsContent value="upload">
            {previewUrl ? renderPreview() : renderFileUploadView()}
        </TabsContent>
    </Tabs>

      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4 text-center p-8 rounded-lg bg-secondary/30">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-semibold text-primary">Analyzing your plant...</p>
          <p className="text-muted-foreground text-sm">Our AI is working its magic. Please wait a moment.</p>
        </div>
      )}

      {error && !loading && activeTab === 'camera' && !hasCameraPermission && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary"/>
              <CardTitle className="font-headline text-2xl">Identification Result</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-primary">{result.plantName}</h3>
              <p className="text-sm text-muted-foreground italic">{result.scientificName}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">AYUSH Information</h4>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.ayushInformation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
