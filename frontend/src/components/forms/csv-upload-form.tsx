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
import { Upload, Download, FileText } from "lucide-react"
import { complianceApi } from "@/lib/api/compliance"

const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
}

interface CSVUploadFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  frameworkId: string
  frameworkName: string
}

export function CSVUploadForm({ open, onOpenChange, frameworkId, frameworkName }: CSVUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      // Use backend API path - auth is handled server-side by the gateway
      const response = await fetch(`/api/compliance/frameworks/${frameworkId}/requirements/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Send cookies for auth
        // Don't set Content-Type header - browser will set it automatically with boundary for FormData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['compliance-requirements'] })
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] })
      
      let message = `Successfully replaced ${data.deleted} existing requirements with ${data.created} new requirements from CSV.`
      
      if (data.errors > 0) {
        message = `Uploaded ${data.created} requirements (replaced ${data.deleted} existing), but ${data.errors} failed. Check console for details.`
        if (data.errorMessages) {
          console.error('Upload errors:', data.errorMessages)
        }
        toast.error(message)
      } else {
        toast.success(message)
      }
      
      setFile(null)
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload CSV file")
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile)
    } else {
      toast.error('Please select a CSV file')
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile)
    } else {
      toast.error('Please drop a CSV file')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleSubmit = () => {
    if (!file) {
      toast.error('Please select a CSV file')
      return
    }
    uploadMutation.mutate(file)
  }

  const downloadTemplate = () => {
    // Provide both format options
    const csvContent = `Requirement ID,Category,Requirement Title,Description,Compliance Deadline,Applicability
REQ-001,Governance,Access Control Policy,Policy for managing user access to systems,January 31 2026,All Authorised Persons
REQ-002,Protection,Data Encryption Standard,Requirement for encrypting sensitive data,January 31 2026,All Authorised Persons
REQ-003,Response and Recovery,Incident Response Procedure,Procedure for handling security incidents,January 31 2026,All Authorised Persons

Alternative Simple Format:
title,description,requirementCode,status
Access Control Policy,Policy for managing user access,REQ-001,not_started
Data Encryption Standard,Requirement for encrypting data,REQ-002,in_progress`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'requirements_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Requirements CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import requirements for {frameworkName}.
            <strong className="text-destructive block mt-2">
              ⚠️ Warning: This will replace all existing requirements for this framework.
            </strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
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
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Drop CSV file here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    CSV files only
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('csv-upload')?.click()}
                >
                  Select File
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Need a template?</span>
            </div>
            <Button variant="ghost" size="sm" onClick={downloadTemplate}>
              <Download className="mr-1 h-3 w-3" />
              Download Template
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>CSV Format (Supported):</strong></p>
            <p><strong>Format 1 (ADGM style):</strong></p>
            <p>Required: <code>Requirement Title</code></p>
            <p>Optional: <code>Requirement ID</code>, <code>Description</code>, <code>Category</code>, <code>Compliance Deadline</code>, <code>Applicability</code></p>
            <p><strong>Format 2 (Simple):</strong></p>
            <p>Required: <code>title</code></p>
            <p>Optional: <code>description</code>, <code>requirementCode</code>, <code>status</code></p>
            <p>Status values: <code>not_started</code>, <code>in_progress</code>, <code>compliant</code>, <code>partially_compliant</code>, <code>non_compliant</code></p>
          </div>
        </div>

        <DialogFooter>
          <Button
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
            onClick={handleSubmit}
            disabled={!file || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload CSV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

async function getAuthToken(): Promise<string> {
  // Auth is now handled server-side through the proxy
  // No need to get token on client - credentials are sent automatically
  return ''
}


