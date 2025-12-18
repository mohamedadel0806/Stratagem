'use client';

import { useState, useCallback, useEffect } from 'react';
// Using native HTML5 file input instead of react-dropzone for simplicity
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi, ImportPreview, ImportResult } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle2, XCircle, AlertCircle, ArrowRight, ArrowLeft, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadSampleExcel } from '@/lib/utils/sample-excel-generator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type AssetType = 'physical' | 'information' | 'software' | 'application' | 'supplier';

interface AssetImportWizardProps {
  assetType?: AssetType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type Step = 'upload' | 'map' | 'preview' | 'importing' | 'results';

// Field mapping options for each asset type
const ASSET_FIELDS: Record<AssetType, Array<{ value: string; label: string }>> = {
  physical: [
    { value: 'skip', label: '-- Skip Column --' },
    { value: 'uniqueIdentifier', label: 'Unique Identifier *' },
    { value: 'assetDescription', label: 'Asset Description *' },
    { value: 'assetTypeId', label: 'Asset Type ID (UUID)' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'model', label: 'Model' },
    { value: 'businessPurpose', label: 'Business Purpose' },
    { value: 'ownerId', label: 'Owner ID (UUID)' },
    { value: 'businessUnitId', label: 'Business Unit ID (UUID)' },
    { value: 'physicalLocation', label: 'Physical Location' },
    { value: 'criticalityLevel', label: 'Criticality Level' },
    { value: 'macAddresses', label: 'MAC Addresses (comma-separated)' },
    { value: 'ipAddresses', label: 'IP Addresses (comma-separated)' },
    { value: 'installedSoftware', label: 'Installed Software (JSON array)' },
    { value: 'activePortsServices', label: 'Active Ports/Services (JSON array)' },
    { value: 'networkApprovalStatus', label: 'Network Approval Status' },
    { value: 'connectivityStatus', label: 'Connectivity Status' },
    { value: 'lastConnectivityCheck', label: 'Last Connectivity Check (ISO date)' },
    { value: 'serialNumber', label: 'Serial Number' },
    { value: 'assetTag', label: 'Asset Tag' },
    { value: 'purchaseDate', label: 'Purchase Date' },
    { value: 'warrantyExpiry', label: 'Warranty Expiry' },
    { value: 'complianceRequirements', label: 'Compliance Requirements (comma-separated)' },
    { value: 'securityTestResults', label: 'Security Test Results (JSON object)' },
  ],
  information: [
    { value: 'skip', label: '-- Skip Column --' },
    { value: 'uniqueIdentifier', label: 'Unique Identifier' },
    { value: 'name', label: 'Name *' },
    { value: 'informationType', label: 'Information Type *' },
    { value: 'description', label: 'Description' },
    { value: 'classificationLevel', label: 'Classification Level *' },
    { value: 'classificationDate', label: 'Classification Date' },
    { value: 'reclassificationDate', label: 'Reclassification Date' },
    { value: 'informationOwnerId', label: 'Information Owner ID' },
    { value: 'assetCustodianId', label: 'Asset Custodian ID' },
    { value: 'businessUnitId', label: 'Business Unit ID' },
    { value: 'assetLocation', label: 'Asset Location' },
    { value: 'storageMedium', label: 'Storage Medium' },
    { value: 'complianceRequirements', label: 'Compliance Requirements (comma-separated)' },
    { value: 'retentionPeriod', label: 'Retention Period' },
  ],
  software: [
    { value: 'skip', label: '-- Skip Column --' },
    { value: 'uniqueIdentifier', label: 'Unique Identifier' },
    { value: 'softwareName', label: 'Software Name *' },
    { value: 'softwareType', label: 'Software Type' },
    { value: 'versionNumber', label: 'Version Number' },
    { value: 'patchLevel', label: 'Patch Level' },
    { value: 'businessPurpose', label: 'Business Purpose' },
    { value: 'ownerId', label: 'Owner ID' },
    { value: 'businessUnitId', label: 'Business Unit ID' },
    { value: 'vendorName', label: 'Vendor Name' },
    { value: 'vendorContact', label: 'Vendor Contact (JSON or name|email|phone)' },
    { value: 'licenseType', label: 'License Type' },
    { value: 'licenseCount', label: 'License Count' },
    { value: 'licenseKey', label: 'License Key' },
    { value: 'licenseExpiry', label: 'License Expiry Date' },
    { value: 'installationCount', label: 'Installation Count' },
    { value: 'lastSecurityTestDate', label: 'Last Security Test Date' },
    { value: 'supportEndDate', label: 'Support End Date' },
  ],
  application: [
    { value: 'skip', label: '-- Skip Column --' },
    { value: 'uniqueIdentifier', label: 'Unique Identifier' },
    { value: 'applicationName', label: 'Application Name *' },
    { value: 'applicationType', label: 'Application Type' },
    { value: 'versionNumber', label: 'Version Number' },
    { value: 'patchLevel', label: 'Patch Level' },
    { value: 'businessPurpose', label: 'Business Purpose' },
    { value: 'ownerId', label: 'Owner ID' },
    { value: 'businessUnitId', label: 'Business Unit ID' },
    { value: 'dataProcessed', label: 'Data Processed (comma-separated)' },
    { value: 'dataClassification', label: 'Data Classification' },
    { value: 'vendorName', label: 'Vendor Name' },
    { value: 'vendorContact', label: 'Vendor Contact (JSON or name|email|phone)' },
    { value: 'licenseType', label: 'License Type' },
    { value: 'licenseCount', label: 'License Count' },
    { value: 'licenseExpiry', label: 'License Expiry Date' },
    { value: 'hostingType', label: 'Hosting Type' },
    { value: 'hostingLocation', label: 'Hosting Location' },
    { value: 'accessUrl', label: 'Access URL' },
    { value: 'lastSecurityTestDate', label: 'Last Security Test Date' },
    { value: 'authenticationMethod', label: 'Authentication Method' },
    { value: 'complianceRequirements', label: 'Compliance Requirements (comma-separated)' },
    { value: 'criticalityLevel', label: 'Criticality Level' },
  ],
  supplier: [
    { value: 'skip', label: '-- Skip Column --' },
    { value: 'uniqueIdentifier', label: 'Unique Identifier *' },
    { value: 'supplierName', label: 'Supplier Name *' },
    { value: 'supplierType', label: 'Supplier Type' },
    { value: 'businessPurpose', label: 'Business Purpose' },
    { value: 'ownerId', label: 'Owner ID' },
    { value: 'businessUnitId', label: 'Business Unit ID' },
    { value: 'goodsServicesType', label: 'Goods/Services Type (comma-separated)' },
    { value: 'criticalityLevel', label: 'Criticality Level' },
    { value: 'contractReference', label: 'Contract Reference' },
    { value: 'contractStartDate', label: 'Contract Start Date' },
    { value: 'contractEndDate', label: 'Contract End Date' },
    { value: 'contractValue', label: 'Contract Value' },
    { value: 'currency', label: 'Currency' },
    { value: 'autoRenewal', label: 'Auto Renewal' },
    { value: 'primaryContact', label: 'Primary Contact (JSON or name|title|email|phone)' },
    { value: 'secondaryContact', label: 'Secondary Contact (JSON or name|title|email|phone)' },
    { value: 'taxId', label: 'Tax ID' },
    { value: 'registrationNumber', label: 'Registration Number' },
    { value: 'address', label: 'Address' },
    { value: 'country', label: 'Country' },
    { value: 'website', label: 'Website' },
    { value: 'riskAssessmentDate', label: 'Risk Assessment Date' },
    { value: 'riskLevel', label: 'Risk Level' },
    { value: 'complianceCertifications', label: 'Compliance Certifications (comma-separated)' },
    { value: 'insuranceVerified', label: 'Insurance Verified' },
    { value: 'backgroundCheckDate', label: 'Background Check Date' },
    { value: 'performanceRating', label: 'Performance Rating' },
    { value: 'lastReviewDate', label: 'Last Review Date' },
  ],
};

export function AssetImportWizard({ assetType = 'physical', onSuccess, onCancel }: AssetImportWizardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'csv' | 'excel'>('csv');
  const [selectedSheet, setSelectedSheet] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const previewMutation = useMutation({
    mutationFn: (params: { file: File; sheetName?: string }) => {
      const { file, sheetName } = params;
      console.log('[Import Wizard] Preview mutation called', {
        assetType,
        fileType,
        fileName: file.name,
        sheetName,
      });
      return assetsApi.previewImportByType(assetType, file, fileType, sheetName);
    },
    onSuccess: (data) => {
      console.log('[Import Wizard] Preview success', { headers: data.headers, totalRows: data.totalRows });
      setPreview(data);
      setSelectedSheet(data.selectedSheet);
      // Auto-map common column names
      const autoMapping: Record<string, string> = {};
      const fields = ASSET_FIELDS[assetType];
      data.headers.forEach((header) => {
        const lowerHeader = header.toLowerCase().trim();
        // Try to find matching field
        const matchingField = fields.find((field) => {
          if (!field.value || field.value === 'skip') return false;
          const fieldLabel = field.label.toLowerCase().replace(/\*/g, '').trim();
          return lowerHeader.includes(fieldLabel) || fieldLabel.includes(lowerHeader);
        });
        if (matchingField?.value) {
          autoMapping[header] = matchingField.value;
        }
      });
      console.log('[Import Wizard] Auto-mapping result', autoMapping);
      setFieldMapping(autoMapping);
      setStep('map');
      toast({
        title: 'File Previewed',
        description: `Found ${data.totalRows} rows. Please map the fields.`,
      });
    },
    onError: (error: any) => {
      console.error('[Import Wizard] Preview error', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to preview file',
        variant: 'destructive',
      });
      setFile(null);
      setPreview(null);
    },
  });

  const importMutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error('No file selected');
      // Convert 'skip' values back to empty strings for the API
      const apiMapping = Object.fromEntries(
        Object.entries(fieldMapping).map(([key, value]) => [key, value === 'skip' ? '' : value])
      );
      return assetsApi.importAssetsByType(assetType, file, fileType, apiMapping);
    },
    onSuccess: (data) => {
      setImportResult(data);
      setStep('results');
      // Invalidate queries based on asset type
      const queryKeys: Record<AssetType, string[]> = {
        physical: ['physical-assets'],
        information: ['information-assets'],
        software: ['software-assets'],
        application: ['business-applications'],
        supplier: ['suppliers'],
      };
      queryClient.invalidateQueries({ queryKey: queryKeys[assetType] });
      toast({
        title: 'Import Complete',
        description: `Successfully imported ${data.successfulImports} of ${data.totalRecords} assets`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to import assets',
        variant: 'destructive',
      });
      setStep('map');
    },
  });

  const [isDragging, setIsDragging] = useState(false);

  // Debug: Log step changes
  useEffect(() => {
    console.log('[Import Wizard] Step changed:', step, { hasPreview: !!preview, previewHeaders: preview?.headers?.length });
  }, [step, preview]);

  const handleFileSelect = (selectedFile: File) => {
    const fileName = selectedFile.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');

    if (!isExcel && !isCSV) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a CSV or Excel file',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
    const nextFileType: 'csv' | 'excel' = isExcel ? 'excel' : 'csv';
    setFileType(nextFileType);
    setSelectedSheet(undefined);
    previewMutation.mutate({ file: selectedFile });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleNext = () => {
    if (step === 'map') {
      // Validate required fields based on asset type
      const requiredFields: Record<AssetType, string[]> = {
        physical: ['uniqueIdentifier', 'assetDescription'],
        information: ['name', 'informationType', 'classificationLevel'],
        software: ['softwareName'],
        application: ['applicationName'],
        supplier: ['supplierName', 'uniqueIdentifier'],
      };

      const required = requiredFields[assetType];
      const mappedFields = Object.values(fieldMapping);
      const hasRequiredFields = required.every(field => mappedFields.includes(field));

      if (!hasRequiredFields) {
        const fieldLabels = required.map(field => {
          const fieldDef = ASSET_FIELDS[assetType].find(f => f.value === field);
          return fieldDef?.label || field;
        }).join(', ');
        toast({
          title: 'Mapping Required',
          description: `Please map the required fields: ${fieldLabels}`,
          variant: 'destructive',
        });
        return;
      }
      setStep('preview');
    } else if (step === 'preview') {
      setStep('importing');
      importMutation.mutate();
    }
  };

  const handleBack = () => {
    if (step === 'map') {
      setStep('upload');
      setFile(null);
      setPreview(null);
      setSelectedSheet(undefined);
      setFieldMapping({});
    } else if (step === 'preview') {
      setStep('map');
    }
  };

  const downloadErrorReport = () => {
    if (!importResult) return;

    const errorRows = importResult.errors.map((err) => ({
      Row: err.row,
      Errors: err.errors.join('; '),
    }));

    const csv = [
      'Row,Errors',
      ...errorRows.map((row) => `${row.Row},"${row.Errors}"`),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import-errors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {['upload', 'map', 'preview', 'importing', 'results'].map((s, index) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === s
                  ? 'bg-primary text-primary-foreground'
                  : index < ['upload', 'map', 'preview', 'importing', 'results'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < ['upload', 'map', 'preview', 'importing', 'results'].indexOf(step) ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < ['upload', 'map', 'preview', 'importing', 'results'].length - 1 && (
              <div
                className={`w-12 h-1 ${
                  index < ['upload', 'map', 'preview', 'importing', 'results'].indexOf(step)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Upload a CSV or Excel file containing {assetType} asset data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await downloadSampleExcel(assetType);
                    toast({
                      title: 'Download Started',
                      description: 'Sample Excel template is downloading',
                    });
                  } catch (error: any) {
                    toast({
                      title: 'Download Failed',
                      description: error.message || 'Failed to download sample file',
                      variant: 'destructive',
                    });
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample Excel
              </Button>
            </div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleFileSelect(files[0]);
                  }
                }}
              />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragging ? (
                <p className="text-lg font-medium">Drop the file here...</p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop a file here, or click to select
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV and Excel files (.csv, .xlsx, .xls)
                  </p>
                </>
              )}
            </div>

            {file && (
              <div className="mt-4 flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  <span className="font-medium">{file.name}</span>
                  <Badge>{fileType.toUpperCase()}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {previewMutation.isPending && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Processing file...</p>
                <Progress value={50} />
              </div>
            )}

            {previewMutation.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {previewMutation.error?.response?.data?.message || previewMutation.error?.message || 'Failed to preview file'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Map Fields */}
      {step === 'map' && preview && (
        <Card>
          <CardHeader>
            <CardTitle>Map Fields</CardTitle>
            <CardDescription>
              Map CSV columns to asset fields. Required fields must be mapped to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fileType === 'excel' && preview.sheets && preview.sheets.length > 1 && (
                <div className="flex items-center gap-4 mb-4">
                  <Label className="w-48 text-right">Worksheet</Label>
                  <Select
                    value={selectedSheet || preview.selectedSheet || preview.sheets[0]}
                    onValueChange={(value) => {
                      setSelectedSheet(value);
                      if (file) {
                        // Re-run preview for the newly selected sheet
                        previewMutation.mutate({ file, sheetName: value });
                      }
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select worksheet" />
                    </SelectTrigger>
                    <SelectContent>
                      {preview.sheets.map((sheet) => (
                        <SelectItem key={sheet} value={sheet}>
                          {sheet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {preview.headers.map((header) => (
                <div key={header} className="flex items-center gap-4">
                  <Label className="w-48 text-right">{header}</Label>
                  <Select
                    value={fieldMapping[header] || undefined}
                    onValueChange={(value) => {
                      setFieldMapping((prev) => ({
                        ...prev,
                        [header]: value === 'skip' ? 'skip' : value,
                      }));
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSET_FIELDS[assetType].map((field) => {
                        // Ensure value is never empty string
                        const itemValue = field.value || 'skip';
                        return (
                          <SelectItem key={itemValue} value={itemValue}>
                            {field.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Tip:</strong> Fields like IP Addresses, MAC Addresses, and Compliance Requirements
                can accept comma or semicolon-separated values. Boolean fields (PII, PHI, etc.) accept
                "true", "yes", "1", or "y".
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && preview && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Data</CardTitle>
            <CardDescription>
              Review the first 10 rows with mapped fields. Total rows: {preview.totalRows}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    {Object.entries(fieldMapping)
                      .filter(([_, field]) => field && field !== 'skip')
                      .map(([csvCol, assetField]) => (
                        <TableHead key={csvCol}>
                          {ASSET_FIELDS[assetType].find((f) => f.value === assetField)?.label || assetField}
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.rows.map((row) => (
                    <TableRow key={row.rowNumber}>
                      <TableCell>{row.rowNumber}</TableCell>
                      {Object.entries(fieldMapping)
                        .filter(([_, field]) => field)
                        .map(([csvCol, assetField]) => (
                          <TableCell key={csvCol}>
                            {row.data[csvCol] || <span className="text-muted-foreground">—</span>}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Importing */}
      {step === 'importing' && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-lg font-medium">Importing assets...</p>
              <p className="text-sm text-muted-foreground">
                This may take a few moments depending on the file size
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Results */}
      {step === 'results' && importResult && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
            <CardDescription>Import completed. Review the results below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{importResult.totalRecords}</div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.successfulImports}
                  </div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.failedImports}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-center">
                      <span>
                        {importResult.errors.length} row(s) had errors
                      </span>
                      <Button variant="outline" size="sm" onClick={downloadErrorReport}>
                        Download Error Report
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {importResult.errors.length > 0 && (
                <div className="max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Errors</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importResult.errors.slice(0, 20).map((error, index) => (
                        <TableRow key={index}>
                          <TableCell>{error.row}</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside">
                              {error.errors.map((err, i) => (
                                <li key={i} className="text-sm text-red-600">
                                  {err}
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {importResult.errors.length > 20 && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Showing first 20 errors. Download full report for complete list.
                    </p>
                  )}
                </div>
              )}

              {importResult.successfulImports > 0 && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Successfully imported {importResult.successfulImports} asset(s). You can view them
                    in the assets list.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div>
          {step !== 'upload' && step !== 'importing' && step !== 'results' && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {onCancel && step !== 'importing' && step !== 'results' && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {step === 'map' && (() => {
            // Check if required fields are mapped
            const requiredFields: Record<AssetType, string[]> = {
              physical: ['uniqueIdentifier', 'assetDescription'],
              information: ['name', 'informationType', 'classificationLevel'],
              software: ['softwareName'],
              application: ['applicationName'],
              supplier: ['supplierName', 'uniqueIdentifier'],
            };
            const required = requiredFields[assetType];
            const mappedFields = Object.values(fieldMapping);
            const hasRequiredFields = required.every(field => mappedFields.includes(field));
            
            return (
              <Button onClick={handleNext} disabled={!hasRequiredFields}>
                Next: Preview
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            );
          })()}
          {step === 'preview' && (
            <Button onClick={handleNext} disabled={importMutation.isPending}>
              Start Import
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          {step === 'results' && (
            <Button onClick={() => { onSuccess?.(); onCancel?.(); }}>
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

