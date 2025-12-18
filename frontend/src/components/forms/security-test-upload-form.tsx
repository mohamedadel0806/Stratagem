'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface SecurityTestUploadFormProps {
  assetType: 'application' | 'software';
  assetId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SecurityTestUploadForm({
  assetType,
  assetId,
  onSuccess,
  onCancel,
}: SecurityTestUploadFormProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [testType, setTestType] = useState<string>('');
  const [testDate, setTestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [testerName, setTesterName] = useState<string>('');
  const [testerCompany, setTesterCompany] = useState<string>('');
  const [findingsCritical, setFindingsCritical] = useState<string>('0');
  const [findingsHigh, setFindingsHigh] = useState<string>('0');
  const [findingsMedium, setFindingsMedium] = useState<string>('0');
  const [findingsLow, setFindingsLow] = useState<string>('0');
  const [findingsInfo, setFindingsInfo] = useState<string>('0');
  const [severity, setSeverity] = useState<string>('');
  const [overallScore, setOverallScore] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [findings, setFindings] = useState<string>('');

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error('Please select a file');
      }
      if (!testType) {
        throw new Error('Please select a test type');
      }
      if (!testDate) {
        throw new Error('Please select a test date');
      }

      return assetsApi.uploadSecurityTestReport(file, {
        assetType,
        assetId,
        testType,
        testDate,
        testerName,
        testerCompany,
        findingsCritical,
        findingsHigh,
        findingsMedium,
        findingsLow,
        findingsInfo,
        severity,
        overallScore,
        summary,
        findings,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Security test report uploaded successfully',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload security test report',
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        'application/pdf',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/xml',
        'text/xml',
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF, CSV, XLS, XLSX, or XML file',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Test Report File *</Label>
        <div className="flex items-center gap-2">
          <Input
            id="file"
            type="file"
            accept=".pdf,.csv,.xls,.xlsx,.xml"
            onChange={handleFileChange}
            className="flex-1"
          />
          {file && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Accepted formats: PDF, CSV, XLS, XLSX, XML (max 50MB)</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="testType">Test Type *</Label>
          <Select value={testType} onValueChange={setTestType}>
            <SelectTrigger id="testType">
              <SelectValue placeholder="Select test type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="penetration_test">Penetration Test</SelectItem>
              <SelectItem value="vulnerability_scan">Vulnerability Scan</SelectItem>
              <SelectItem value="code_review">Code Review</SelectItem>
              <SelectItem value="compliance_audit">Compliance Audit</SelectItem>
              <SelectItem value="security_assessment">Security Assessment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="testDate">Test Date *</Label>
          <Input
            id="testDate"
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="testerName">Tester Name</Label>
          <Input
            id="testerName"
            value={testerName}
            onChange={(e) => setTesterName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="testerCompany">Tester Company</Label>
          <Input
            id="testerCompany"
            value={testerCompany}
            onChange={(e) => setTesterCompany(e.target.value)}
            placeholder="Security Firm Inc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Findings Count</Label>
        <div className="grid grid-cols-5 gap-2">
          <div>
            <Label htmlFor="critical" className="text-xs">Critical</Label>
            <Input
              id="critical"
              type="number"
              min="0"
              value={findingsCritical}
              onChange={(e) => setFindingsCritical(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="high" className="text-xs">High</Label>
            <Input
              id="high"
              type="number"
              min="0"
              value={findingsHigh}
              onChange={(e) => setFindingsHigh(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="medium" className="text-xs">Medium</Label>
            <Input
              id="medium"
              type="number"
              min="0"
              value={findingsMedium}
              onChange={(e) => setFindingsMedium(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="low" className="text-xs">Low</Label>
            <Input
              id="low"
              type="number"
              min="0"
              value={findingsLow}
              onChange={(e) => setFindingsLow(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="info" className="text-xs">Info</Label>
            <Input
              id="info"
              type="number"
              min="0"
              value={findingsInfo}
              onChange={(e) => setFindingsInfo(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="severity">Severity</Label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger id="severity">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="overallScore">Overall Score (0-100)</Label>
          <Input
            id="overallScore"
            type="number"
            min="0"
            max="100"
            value={overallScore}
            onChange={(e) => setOverallScore(e.target.value)}
            placeholder="85"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief summary of the test results..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="findings">Detailed Findings</Label>
        <Textarea
          id="findings"
          value={findings}
          onChange={(e) => setFindings(e.target.value)}
          placeholder="Detailed findings from the security test..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={uploadMutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={() => uploadMutation.mutate()}
          disabled={uploadMutation.isPending || !file || !testType || !testDate}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploadMutation.isPending ? 'Uploading...' : 'Upload Report'}
        </Button>
      </div>
    </div>
  );
}

