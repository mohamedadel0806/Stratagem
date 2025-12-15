"use client"

import * as React from "react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, XCircle } from "lucide-react"
import { policiesApi } from "@/lib/api/policies"

const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

interface PolicyDocumentUploadProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  policyId: string
  policyName: string
}

export function PolicyDocumentUpload({ open, onOpenChange, policyId, policyName }: PolicyDocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return policiesApi.uploadDocument(policyId, file)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy', policyId] })
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      toast.success("Document uploaded successfully")
      setFile(null)
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload document")
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0])
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleRemoveFile = () => {
    setFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document for {policyName}</DialogTitle>
          <DialogDescription>
            Upload a document file (PDF, DOC, DOCX) for this policy. Maximum file size: 10MB.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {file ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 mx-auto text-primary" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFile}
                >
                  <XCircle className="mr-1 h-3 w-3" />
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Drop file here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, DOCX files only (max 10MB)
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                  id="policy-document-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('policy-document-upload')?.click()}
                >
                  Select File
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFile(null)
              onOpenChange(false)
            }}
            disabled={uploadMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => file && uploadMutation.mutate(file)}
            disabled={!file || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

