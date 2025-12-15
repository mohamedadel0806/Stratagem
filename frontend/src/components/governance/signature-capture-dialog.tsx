'use client';

import { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Upload, PenTool, RotateCcw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignatureCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignatureCapture: (signatureData: {
    signatureData: string;
    signatureMethod: 'drawn' | 'uploaded';
    signatureMetadata?: Record<string, any>;
  }) => void;
}

export function SignatureCaptureDialog({ 
  open, 
  onOpenChange, 
  onSignatureCapture 
}: SignatureCaptureDialogProps) {
  const { toast } = useToast();
  const [signatureMethod, setSignatureMethod] = useState<'drawn' | 'uploaded'>('drawn');
  const [signatureImage, setSignatureImage] = useState<string>('');
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
  }, [open]);

  const handleClear = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
  };

  const handleDrawnSignature = () => {
    if (sigCanvasRef.current) {
      const canvas = sigCanvasRef.current.getCanvas();
      const signatureData = canvas.toDataURL('image/png');
      
      const metadata = {
        capturedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        method: 'drawn',
      };

      onSignatureCapture({
        signatureData,
        signatureMethod: 'drawn',
        signatureMetadata: metadata,
      });
      
      onOpenChange(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setSignatureImage(result);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: 'Invalid File',
          description: 'Please upload an image file (PNG, JPG, etc.)',
          variant: 'destructive',
        });
      }
    }
  };

  const handleUploadedSignature = () => {
    if (signatureImage) {
      const metadata = {
        capturedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        method: 'uploaded',
        fileName: fileInputRef.current?.files?.[0]?.name,
      };

      onSignatureCapture({
        signatureData: signatureImage,
        signatureMethod: 'uploaded',
        signatureMetadata: metadata,
      });
      
      onOpenChange(false);
      setSignatureImage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleMethodChange = (method: 'drawn' | 'uploaded') => {
    setSignatureMethod(method);
    if (method === 'drawn' && sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
    setSignatureImage('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Capture Digital Signature</DialogTitle>
          <DialogDescription>
            Please provide your digital signature for this approval. You can either draw your signature or upload an image file.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Method Selection */}
          <div className="space-y-2">
            <Label>Signature Method</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={signatureMethod === 'drawn' ? 'default' : 'outline'}
                onClick={() => handleMethodChange('drawn')}
                className="flex items-center gap-2"
              >
                <PenTool className="h-4 w-4" />
                Draw Signature
              </Button>
              <Button
                type="button"
                variant={signatureMethod === 'uploaded' ? 'default' : 'outline'}
                onClick={() => handleMethodChange('uploaded')}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Signature
              </Button>
            </div>
          </div>

          {/* Signature Canvas */}
          {signatureMethod === 'drawn' && (
            <div className="space-y-2">
              <Label>Draw your signature below</Label>
              <div className="border-2 border-gray-300 rounded-lg p-2 bg-white">
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="black"
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: 'w-full h-auto',
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* File Upload */}
          {signatureMethod === 'uploaded' && (
            <div className="space-y-2">
              <Label>Upload signature image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              
              {signatureImage && (
                <div className="mt-4 space-y-2">
                  <Label>Preview</Label>
                  <img 
                    src={signatureImage} 
                    alt="Signature preview" 
                    className="max-h-32 border border-gray-300 rounded"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={
              signatureMethod === 'drawn' 
                ? handleDrawnSignature 
                : handleUploadedSignature
            }
            disabled={signatureMethod === 'uploaded' && !signatureImage}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Use Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}