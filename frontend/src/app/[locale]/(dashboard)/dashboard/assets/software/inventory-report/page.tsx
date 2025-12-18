'use client';

import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exportToExcel } from '@/lib/utils/excel-export';
import { generatePDFTable } from '@/lib/utils/pdf-export';

export default function SoftwareInventoryReportPage() {
  const { toast } = useToast();
  const [groupBy, setGroupBy] = useState<'type' | 'vendor' | 'none'>('none');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['software-inventory-report', groupBy],
    queryFn: () => assetsApi.getSoftwareInventoryReport(groupBy),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const handleExportExcel = async () => {
    if (!data) return;

    try {
      const exportData: any[] = [];
      
      // Add summary
      exportData.push({});
      exportData.push({ 'Metric': 'Total Software', 'Value': data.summary.totalSoftware });
      exportData.push({ 'Metric': 'Total Installations', 'Value': data.summary.totalInstallations });
      exportData.push({ 'Metric': 'Unlicensed Software', 'Value': data.summary.unlicensedCount });
      exportData.push({ 'Metric': 'Expired Licenses', 'Value': data.summary.expiredLicenseCount });
      exportData.push({});

      // Add grouped data
      for (const [groupName, items] of Object.entries(data.grouped)) {
        exportData.push({ 'Group': groupName });
        items.forEach((item: any) => {
          exportData.push({
            'Software Name': item.softwareName,
            'Version': item.version,
            'Patch Level': item.patchLevel,
            'Vendor': item.vendor,
            'Type': item.softwareType,
            'Installations': item.installationCount,
            'License Count': item.licenseCount || 'N/A',
            'License Type': item.licenseType || 'N/A',
            'License Expiry': item.licenseExpiry ? new Date(item.licenseExpiry).toLocaleDateString() : 'N/A',
            'License Status': item.licenseStatus,
            'Business Units': item.businessUnits.join(', '),
          });
        });
        exportData.push({});
      }

      // Add unlicensed software
      if (data.unlicensed.length > 0) {
        exportData.push({ 'Unlicensed Software': '' });
        data.unlicensed.forEach((item: any) => {
          exportData.push({
            'Software Name': item.softwareName,
            'Version': item.version,
            'Patch Level': item.patchLevel,
            'Vendor': item.vendor,
            'Type': item.softwareType,
            'Installations': item.installationCount,
            'Business Units': item.businessUnits.join(', '),
            'Reason': item.reason === 'no_license' ? 'No License' : item.reason === 'expired_license' ? 'Expired License' : 'Installations Exceed License',
          });
        });
      }

      await exportToExcel(exportData, `software-inventory-report-${new Date().toISOString().split('T')[0]}`, 'Software Inventory');
      toast({
        title: 'Success',
        description: 'Software inventory report exported successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  const handleExportPDF = () => {
    if (!data) return;

    try {
      const allItems: any[] = [];
      for (const items of Object.values(data.grouped)) {
        allItems.push(...items);
      }

      generatePDFTable(
        allItems.map((item: any) => ({
          'Software Name': item.softwareName,
          'Version': item.version,
          'Patch Level': item.patchLevel,
          'Vendor': item.vendor,
          'Type': item.softwareType,
          'Installations': item.installationCount.toString(),
          'License Status': item.licenseStatus,
        })),
        [
          { header: 'Software Name', dataKey: 'Software Name' },
          { header: 'Version', dataKey: 'Version' },
          { header: 'Patch Level', dataKey: 'Patch Level' },
          { header: 'Vendor', dataKey: 'Vendor' },
          { header: 'Type', dataKey: 'Type' },
          { header: 'Installations', dataKey: 'Installations' },
          { header: 'License Status', dataKey: 'License Status' },
        ],
        {
          title: 'Software Inventory Report',
          subtitle: `Generated on ${new Date().toLocaleDateString()}`,
          filename: `software-inventory-report-${new Date().toISOString().split('T')[0]}`,
          orientation: 'landscape',
        }
      );

      toast({
        title: 'Success',
        description: 'PDF report generated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate PDF',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error loading report: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button className="mt-4" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Software Inventory Report</h1>
          <p className="text-muted-foreground">Comprehensive view of all software assets, licenses, and installations</p>
        </div>
        <div className="flex gap-2">
          <Select value={groupBy} onValueChange={(value: 'type' | 'vendor' | 'none') => setGroupBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="type">Group by Type</SelectItem>
              <SelectItem value="vendor">Group by Vendor</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Software</CardDescription>
            <CardTitle className="text-3xl">{data.summary.totalSoftware}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Installations</CardDescription>
            <CardTitle className="text-3xl">{data.summary.totalInstallations}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unlicensed Software</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{data.summary.unlicensedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expired Licenses</CardDescription>
            <CardTitle className="text-3xl text-red-600">{data.summary.expiredLicenseCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Software</TabsTrigger>
          <TabsTrigger value="unlicensed">Unlicensed ({data.unlicensed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {Object.entries(data.grouped).map(([groupName, items]) => (
            <Card key={groupName}>
              <CardHeader>
                <CardTitle>{groupName}</CardTitle>
                <CardDescription>{items.length} software {items.length === 1 ? 'item' : 'items'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.softwareName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.vendor} • {item.softwareType}
                          </p>
                        </div>
                        <Badge
                          variant={
                            item.licenseStatus === 'licensed'
                              ? 'default'
                              : item.licenseStatus === 'expired'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className={
                            item.licenseStatus === 'licensed'
                              ? 'bg-green-100 text-green-800'
                              : item.licenseStatus === 'expired'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {item.licenseStatus === 'licensed'
                            ? 'Licensed'
                            : item.licenseStatus === 'expired'
                            ? 'Expired'
                            : item.licenseStatus === 'unlicensed'
                            ? 'Unlicensed'
                            : item.licenseStatus === 'installation_exceeds_license'
                            ? 'Exceeds License'
                            : 'Unknown'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Version</p>
                          <p>{item.version} {item.patchLevel !== 'N/A' && `(${item.patchLevel})`}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Installations</p>
                          <p>{item.installationCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">License Count</p>
                          <p>{item.licenseCount || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">License Expiry</p>
                          <p>{item.licenseExpiry ? new Date(item.licenseExpiry).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      {item.businessUnits && item.businessUnits.length > 0 && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">Business Units:</p>
                          <p>{item.businessUnits.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="unlicensed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unlicensed or Unauthorized Software</CardTitle>
              <CardDescription>{data.unlicensed.length} software {data.unlicensed.length === 1 ? 'item' : 'items'} require attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.unlicensed.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No unlicensed software found</p>
                ) : (
                  data.unlicensed.map((item: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.softwareName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.vendor} • {item.softwareType}
                          </p>
                        </div>
                        <Badge
                          variant="destructive"
                          className="bg-red-100 text-red-800"
                        >
                          {item.reason === 'no_license'
                            ? 'No License'
                            : item.reason === 'expired_license'
                            ? 'Expired License'
                            : 'Exceeds License'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Version</p>
                          <p>{item.version} {item.patchLevel !== 'N/A' && `(${item.patchLevel})`}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Installations</p>
                          <p>{item.installationCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Business Units</p>
                          <p>{item.businessUnits.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

