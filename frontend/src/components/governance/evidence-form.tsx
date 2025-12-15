'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  governanceApi,
  CreateEvidenceData,
  Evidence,
  EvidenceType,
  EvidenceStatus,
} from '@/lib/api/governance';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import { Upload, FileText, X, Download, Loader2 } from 'lucide-react';

const evidenceSchema = z.object({
  evidence_identifier: z.string().min(1, 'Identifier is required').max(100),
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().optional(),
  evidence_type: z.nativeEnum(EvidenceType),
  filename: z.string().optional(),
  file_path: z.string().optional(), // Make optional since we can upload file
  file_size: z.number().optional(),
  mime_type: z.string().optional(),
  collection_date: z.string().optional(),
  valid_from_date: z.string().optional(),
  valid_until_date: z.string().optional(),
  collector_id: z.string().uuid().optional().or(z.literal('')),
  status: z.nativeEnum(EvidenceStatus).optional(),
  tags: z.array(z.string()).optional(),
  confidential: z.boolean().optional(),
});

type EvidenceFormData = z.infer<typeof evidenceSchema>;

interface EvidenceFormProps {
  evidence?: Evidence | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const TEMPLATE_FILE_PATH = '/uploads/evidence-template-sample.txt';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function EvidenceForm({ evidence, onSuccess, onCancel }: EvidenceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState<{
    filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
  } | null>(null);

  const form = useForm<EvidenceFormData>({
    resolver: zodResolver(evidenceSchema),
    defaultValues: evidence
      ? {
          evidence_identifier: evidence.evidence_identifier,
          title: evidence.title,
          description: evidence.description,
          evidence_type: evidence.evidence_type,
          filename: evidence.filename,
          file_path: evidence.file_path,
          file_size: evidence.file_size,
          mime_type: evidence.mime_type,
          collection_date: evidence.collection_date,
          valid_from_date: evidence.valid_from_date,
          valid_until_date: evidence.valid_until_date,
          collector_id: evidence.collector_id,
          status: evidence.status,
          tags: evidence.tags,
          confidential: evidence.confidential,
        }
      : {
          status: EvidenceStatus.DRAFT,
          evidence_type: EvidenceType.OTHER,
          confidential: false,
        },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => governanceApi.uploadEvidenceFile(file),
    onSuccess: (data) => {
      setUploadedFileData({
        filename: data.filename,
        file_path: data.file_path,
        file_size: data.file_size,
        mime_type: data.mime_type,
      });
      form.setValue('file_path', data.file_path);
      form.setValue('filename', data.filename);
      form.setValue('file_size', data.file_size);
      form.setValue('mime_type', data.mime_type);
      setUploadProgress(false);
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    },
    onError: (error: any) => {
      setUploadProgress(false);
      toast({
        title: 'Upload Failed',
        description: error.response?.data?.message || 'Failed to upload file',
        variant: 'destructive',
      });
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateEvidenceData) => {
      if (evidence) {
        return governanceApi.updateEvidence(evidence.id, data);
      }
      return governanceApi.createEvidence(data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: evidence ? 'Evidence updated successfully' : 'Evidence created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save evidence',
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File Too Large',
        description: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setUploadedFileData(null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploadProgress(true);
    uploadMutation.mutate(selectedFile);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadedFileData(null);
    form.setValue('file_path', '');
    form.setValue('filename', '');
    form.setValue('file_size', undefined);
    form.setValue('mime_type', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: EvidenceFormData) => {
    // If file is selected but not uploaded yet, upload it first
    if (selectedFile && !uploadedFileData) {
      toast({
        title: 'Upload Required',
        description: 'Please upload the selected file before saving',
        variant: 'destructive',
      });
      return;
    }

    // Validate file_path is provided (either uploaded or manually entered)
    if (!data.file_path && !uploadedFileData) {
      toast({
        title: 'File Required',
        description: 'Please upload a file or provide a file path',
        variant: 'destructive',
      });
      form.setError('file_path', { message: 'File path is required' });
      return;
    }

    mutation.mutate(data as CreateEvidenceData);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="evidence_identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evidence Identifier *</FormLabel>
                <FormControl>
                  <Input placeholder="EVID-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="MFA Configuration Screenshot" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Evidence description..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="evidence_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evidence Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select evidence type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EvidenceType.POLICY_DOCUMENT}>Policy Document</SelectItem>
                    <SelectItem value={EvidenceType.CONFIGURATION_SCREENSHOT}>Configuration Screenshot</SelectItem>
                    <SelectItem value={EvidenceType.SYSTEM_LOG}>System Log</SelectItem>
                    <SelectItem value={EvidenceType.SCAN_REPORT}>Scan Report</SelectItem>
                    <SelectItem value={EvidenceType.TEST_RESULT}>Test Result</SelectItem>
                    <SelectItem value={EvidenceType.CERTIFICATION}>Certification</SelectItem>
                    <SelectItem value={EvidenceType.TRAINING_RECORD}>Training Record</SelectItem>
                    <SelectItem value={EvidenceType.MEETING_MINUTES}>Meeting Minutes</SelectItem>
                    <SelectItem value={EvidenceType.EMAIL_CORRESPONDENCE}>Email Correspondence</SelectItem>
                    <SelectItem value={EvidenceType.CONTRACT}>Contract</SelectItem>
                    <SelectItem value={EvidenceType.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EvidenceStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={EvidenceStatus.UNDER_REVIEW}>Under Review</SelectItem>
                    <SelectItem value={EvidenceStatus.APPROVED}>Approved</SelectItem>
                    <SelectItem value={EvidenceStatus.EXPIRED}>Expired</SelectItem>
                    <SelectItem value={EvidenceStatus.REJECTED}>Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>File Upload</FormLabel>
            <a
              href={TEMPLATE_FILE_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Download Template
            </a>
          </div>

          {!evidence && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="space-y-4">
                {!selectedFile && !uploadedFileData && (
                  <div className="text-center">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="h-10 w-10 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, TXT, CSV (Max {MAX_FILE_SIZE / 1024 / 1024}MB)
                      </p>
                    </label>
                  </div>
                )}

                {selectedFile && !uploadedFileData && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={handleFileUpload}
                        disabled={uploadProgress}
                        size="sm"
                      >
                        {uploadProgress ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleFileRemove}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {uploadedFileData && (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">{uploadedFileData.filename}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(uploadedFileData.file_size)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleFileRemove}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manual file path entry (for editing existing or manual entry) */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="file_path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Path {!evidence && '(or enter manually)'}</FormLabel>
                  <FormControl>
                    <Input placeholder="/uploads/evidence/file.pdf" {...field} />
                  </FormControl>
                  <FormDescription>
                    {!evidence ? 'Enter file path manually if not uploading a file' : 'File path'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filename</FormLabel>
                  <FormControl>
                    <Input placeholder="evidence-file.pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="collection_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valid_from_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid From</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valid_until_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid Until</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="confidential"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Confidential</FormLabel>
                <p className="text-sm text-muted-foreground">Mark this evidence as confidential</p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending || uploadProgress}>
            {mutation.isPending ? 'Saving...' : evidence ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
