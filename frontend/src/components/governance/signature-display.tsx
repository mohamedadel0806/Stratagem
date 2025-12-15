'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Download, Calendar, User } from 'lucide-react';

interface SignatureDisplayProps {
  signatureData?: string;
  signatureTimestamp?: string;
  signatureMethod?: string;
  signatureMetadata?: Record<string, any>;
  approverName?: string;
  compact?: boolean; // For inline display in tables
}

export function SignatureDisplay({ 
  signatureData, 
  signatureTimestamp, 
  signatureMethod, 
  signatureMetadata,
  approverName,
  compact = false 
}: SignatureDisplayProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!signatureData) {
    return (
      <span className="text-gray-500 text-sm">No signature</span>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `signature_${approverName?.replace(/\s+/g, '_')}_${new Date().toISOString()}.png`;
    link.href = signatureData;
    link.click();
  };

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="h-8 px-2"
        >
          <Eye className="h-3 w-3" />
        </Button>
        <span className="text-xs text-gray-600">
          {signatureMethod === 'drawn' ? 'Drawn' : 'Uploaded'} on {formatDate(signatureTimestamp)}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Signature Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Digital Signature</h4>
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-white max-w-md">
            <img 
              src={signatureData} 
              alt="Digital signature" 
              className="w-full h-auto max-h-24 object-contain"
            />
          </div>
        </div>

        {/* Signature Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Signed by:</span>
            <span>{approverName || 'Unknown'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Signed at:</span>
            <span>{formatDate(signatureTimestamp)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Method:</span>
            <span className="capitalize">{signatureMethod || 'Unknown'}</span>
          </div>

          {signatureMetadata?.fileName && (
            <div className="flex items-center gap-2">
              <span className="font-medium">File:</span>
              <span>{signatureMetadata.fileName}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Full Size
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Full Size Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Digital Signature</DialogTitle>
            <DialogDescription>
              Full size view of the digital signature with metadata
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Large Signature Display */}
            <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
              <img 
                src={signatureData} 
                alt="Digital signature" 
                className="w-full h-auto max-h-64 object-contain"
              />
            </div>

            {/* Detailed Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <h4 className="font-medium text-base">Signature Information</h4>
                
                <div>
                  <span className="font-medium">Signed by:</span>
                  <span className="ml-2">{approverName || 'Unknown'}</span>
                </div>
                
                <div>
                  <span className="font-medium">Signed at:</span>
                  <span className="ml-2">{formatDate(signatureTimestamp)}</span>
                </div>
                
                <div>
                  <span className="font-medium">Method:</span>
                  <span className="ml-2 capitalize">{signatureMethod || 'Unknown'}</span>
                </div>

                {signatureMetadata?.fileName && (
                  <div>
                    <span className="font-medium">Original file:</span>
                    <span className="ml-2">{signatureMetadata.fileName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-base">Technical Details</h4>
                
                {signatureMetadata?.capturedAt && (
                  <div>
                    <span className="font-medium">Captured at:</span>
                    <span className="ml-2">{formatDate(signatureMetadata.capturedAt)}</span>
                  </div>
                )}
                
                {signatureMetadata?.userAgent && (
                  <div>
                    <span className="font-medium">Browser:</span>
                    <span className="ml-2 text-xs break-all">
                      {signatureMetadata.userAgent}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}