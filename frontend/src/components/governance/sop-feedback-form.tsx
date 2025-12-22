'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi } from '@/lib/api/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, Plus, Trash2, AlertCircle, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SOPFeedbackFormProps {
  sopId: string;
  readOnly?: boolean;
}

export function SOPFeedbackForm({ sopId, readOnly = false }: SOPFeedbackFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  // Fetch feedback for this SOP
  const { data: feedbackList, isLoading } = useQuery({
    queryKey: ['sop-feedback', sopId],
    queryFn: () => governanceApi.getSOPFeedback?.(sopId),
    enabled: !!sopId,
  });

  // Submit feedback mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      return governanceApi.createSOPFeedback?.({
        sop_id: sopId,
        rating,
        comment: comment || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Thank you for your feedback!',
      });
      queryClient.invalidateQueries({ queryKey: ['sop-feedback', sopId] });
      setIsOpen(false);
      setRating(0);
      setComment('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit feedback',
        variant: 'destructive',
      });
    },
  });

  // Delete feedback mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteSOPFeedback?.(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Feedback deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['sop-feedback', sopId] });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete feedback',
        variant: 'destructive',
      });
    },
  });

  // Calculate average rating
  const averageRating =
    feedbackList && feedbackList.length > 0
      ? (feedbackList.reduce((sum: number, f: any) => sum + (f.rating || 0), 0) / feedbackList.length).toFixed(1)
      : 0;

  const sentimentMap: Record<number, string> = {
    1: '😞 Very Unsatisfied',
    2: '😕 Unsatisfied',
    3: '😐 Neutral',
    4: '🙂 Satisfied',
    5: '😄 Very Satisfied',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageRating}</div>
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(Number(averageRating))
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{feedbackList?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">responses received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {sentimentMap[Math.round(Number(averageRating))] || 'No data'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Feedback Button */}
      {!readOnly && (
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Submit Feedback
        </Button>
      )}

      {/* Feedback List */}
      {feedbackList && feedbackList.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold">Recent Feedback</h3>
          {feedbackList.map((feedback: any) => (
            <Card key={feedback.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < feedback.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {sentimentMap[feedback.rating]}
                      </span>
                      {feedback.sentiment_score && (
                        <Badge variant="outline" className="ml-2">
                          Sentiment: {(feedback.sentiment_score * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>

                    {/* Comment */}
                    {feedback.comment && (
                      <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                    )}

                    {/* Metadata */}
                    <div className="text-xs text-muted-foreground pt-2">
                      {feedback.created_by && (
                        <span>
                          {feedback.created_by === 'anonymous'
                            ? 'Anonymous'
                            : feedback.created_by}
                        </span>
                      )}
                      {feedback.created_at && (
                        <span> • {new Date(feedback.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(feedback.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No feedback yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to share your feedback on this SOP
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submit Feedback Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
              Help us improve this SOP by sharing your feedback
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="text-sm font-medium">How satisfied are you?</label>
              <div className="flex gap-4 mt-3 text-4xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-muted-foreground mt-2">{sentimentMap[rating]}</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium">Additional Comments (Optional)</label>
              <Textarea
                placeholder="Share your thoughts, suggestions, or concerns..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-2 min-h-[100px]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending || rating === 0}
              >
                {submitMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SOPFeedbackForm;
