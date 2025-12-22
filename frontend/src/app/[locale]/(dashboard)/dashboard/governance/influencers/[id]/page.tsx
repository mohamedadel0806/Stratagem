'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi, Influencer, InfluencerCategory, InfluencerStatus, ApplicabilityStatus } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowLeft, ExternalLink, FileText, Calendar, Building2, MapPin, CheckCircle2, History } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InfluencerForm } from '@/components/governance/influencer-form';
import { InfluencerReviewForm } from '@/components/governance/influencer-review-form';
import { InfluencerRevisionHistory } from '@/components/governance/influencer-revision-history';
import { AIMappingSuggestions } from '@/components/governance/ai-mapping-suggestions';

const categoryLabels: Record<InfluencerCategory, string> = {
  [InfluencerCategory.INTERNAL]: 'Internal',
  [InfluencerCategory.CONTRACTUAL]: 'Contractual',
  [InfluencerCategory.STATUTORY]: 'Statutory',
  [InfluencerCategory.REGULATORY]: 'Regulatory',
  [InfluencerCategory.INDUSTRY_STANDARD]: 'Industry Standard',
};

const statusLabels: Record<InfluencerStatus, string> = {
  [InfluencerStatus.ACTIVE]: 'Active',
  [InfluencerStatus.PENDING]: 'Pending',
  [InfluencerStatus.SUPERSEDED]: 'Superseded',
  [InfluencerStatus.RETIRED]: 'Retired',
};

const applicabilityLabels: Record<ApplicabilityStatus, string> = {
  [ApplicabilityStatus.APPLICABLE]: 'Applicable',
  [ApplicabilityStatus.NOT_APPLICABLE]: 'Not Applicable',
  [ApplicabilityStatus.UNDER_REVIEW]: 'Under Review',
};

export default function InfluencerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const influencerId = params.id as string;

  const { data: influencerData, isLoading, error } = useQuery({
    queryKey: ['influencer', influencerId],
    queryFn: () => governanceApi.getInfluencer(influencerId),
    enabled: !!influencerId,
  });

  const influencer = influencerData?.data;
  const isUnauthorized = (error as any)?.response?.status === 401;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteInfluencer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['influencers'] });
      toast({
        title: 'Success',
        description: 'Influencer deleted successfully',
      });
      router.push(`/${locale}/dashboard/governance/influencers`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete influencer',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading influencer details...</p>
        </div>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Please log in to view this influencer</p>
            <Button onClick={() => router.push(`/${locale}/login`)}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Influencer not found</p>
            <Button onClick={() => router.push(`/${locale}/dashboard/governance/influencers`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Influencers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/governance/influencers`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{influencer.name}</h1>
            {influencer.reference_number && (
              <p className="text-muted-foreground">{influencer.reference_number}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsReviewOpen(true)}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Review
          </Button>
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Are you sure you want to delete this influencer?')) {
                deleteMutation.mutate(influencer.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* AI Mapping Suggestions */}
      <AIMappingSuggestions influencerId={influencerId} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <Badge variant="outline" className="mt-1">
                {categoryLabels[influencer.category]}
              </Badge>
            </div>
            {influencer.sub_category && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sub Category</p>
                <p className="text-sm">{influencer.sub_category}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge
                variant={
                  influencer.status === InfluencerStatus.ACTIVE
                    ? 'default'
                    : influencer.status === InfluencerStatus.PENDING
                    ? 'secondary'
                    : 'outline'
                }
                className="mt-1"
              >
                {statusLabels[influencer.status]}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Applicability</p>
              <Badge
                variant={
                  influencer.applicability_status === ApplicabilityStatus.APPLICABLE
                    ? 'default'
                    : influencer.applicability_status === ApplicabilityStatus.NOT_APPLICABLE
                    ? 'secondary'
                    : 'outline'
                }
                className="mt-1"
              >
                {applicabilityLabels[influencer.applicability_status]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authority & Jurisdiction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {influencer.issuing_authority && (
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Issuing Authority
                </p>
                <p className="text-sm mt-1">{influencer.issuing_authority}</p>
              </div>
            )}
            {influencer.jurisdiction && (
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Jurisdiction
                </p>
                <p className="text-sm mt-1">{influencer.jurisdiction}</p>
              </div>
            )}
            {influencer.reference_number && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reference Number</p>
                <p className="text-sm mt-1">{influencer.reference_number}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ownership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {influencer.owner ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Owner</p>
                <p className="text-sm mt-1">
                  {influencer.owner.first_name} {influencer.owner.last_name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{influencer.owner.email}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No owner assigned</p>
            )}
            {influencer.business_units_affected && influencer.business_units_affected.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Business Units Affected</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {influencer.business_units_affected.map((unit) => (
                    <Badge key={unit} variant="outline" className="text-xs">
                      {unit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {influencer.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{influencer.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Important Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {influencer.publication_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Publication Date</p>
                <p className="text-sm">
                  {new Date(influencer.publication_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {influencer.effective_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Effective Date</p>
                <p className="text-sm">
                  {new Date(influencer.effective_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {influencer.last_revision_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Revision Date</p>
                <p className="text-sm">
                  {new Date(influencer.last_revision_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {influencer.revision_notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revision Notes</p>
                <p className="text-sm whitespace-pre-wrap">{influencer.revision_notes}</p>
              </div>
            )}
            {influencer.next_review_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Review Date</p>
                <p className="text-sm">
                  {new Date(influencer.next_review_date).toLocaleDateString()}
                </p>
                {influencer.review_frequency_days && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Review every {influencer.review_frequency_days} days
                  </p>
                )}
              </div>
            )}
            {influencer.applicability_assessment_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applicability Assessment Date</p>
                <p className="text-sm">
                  {new Date(influencer.applicability_assessment_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applicability Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {influencer.applicability_justification && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Justification</p>
                <p className="text-sm whitespace-pre-wrap">{influencer.applicability_justification}</p>
              </div>
            )}
            {influencer.applicability_criteria && Object.keys(influencer.applicability_criteria).length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Criteria</p>
                <div className="text-sm space-y-1 mt-1">
                  {Object.entries(influencer.applicability_criteria).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {(influencer.source_url || influencer.source_document_path) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Source Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {influencer.source_url && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Source URL</p>
                <a
                  href={influencer.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                >
                  {influencer.source_url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {influencer.source_document_path && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Document</p>
                <a
                  href={influencer.source_document_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                >
                  View Document
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {influencer.tags && influencer.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {influencer.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {influencer.custom_fields && Object.keys(influencer.custom_fields).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(influencer.custom_fields).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="text-sm font-medium text-muted-foreground">{key}</span>
                  <span className="text-sm">{String(value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(influencer.created_at).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated:</span>
            <span>{new Date(influencer.updated_at).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Revision History */}
      <InfluencerRevisionHistory influencerId={influencer.id} />

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Influencer</DialogTitle>
            <DialogDescription>Update influencer information</DialogDescription>
          </DialogHeader>
          <InfluencerForm
            influencer={influencer}
            onSuccess={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ['influencer', influencerId] });
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Influencer</DialogTitle>
            <DialogDescription>
              Complete a review of this influencer and document any changes or impact assessment
            </DialogDescription>
          </DialogHeader>
          <InfluencerReviewForm
            influencer={influencer}
            onSuccess={() => {
              setIsReviewOpen(false);
              queryClient.invalidateQueries({ queryKey: ['influencer', influencerId] });
              queryClient.invalidateQueries({ queryKey: ['influencer-revisions', influencerId] });
            }}
            onCancel={() => setIsReviewOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

