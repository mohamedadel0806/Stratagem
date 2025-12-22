"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Bell,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
  Shield,
  Activity,
  ChevronRight,
  Loader2,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react";
import {
  governanceApi,
  Policy,
  SOP,
  Influencer,
} from "@/lib/api/governance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function GovernanceNotificationsPage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const { data: duePolicies, isLoading: isPoliciesLoading } = useQuery({
    queryKey: ["policies-due-review"],
    queryFn: () => governanceApi.getPoliciesDueForReview(90),
  });

  const { data: upcomingReviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["governance-upcoming-reviews"],
    queryFn: async () => {
      const dashboard = await governanceApi.getDashboard();
      return dashboard.upcomingReviews;
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'policy': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'sop': return <Activity className="h-4 w-4 text-green-500" />;
      case 'influencer': return <Shield className="h-4 w-4 text-orange-500" />;
      case 'assessment': return <ClipboardCheck className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getDaysBadge = (days: number) => {
    if (days < 0) return <Badge variant="destructive">Overdue by {Math.abs(days)} days</Badge>;
    if (days <= 7) return <Badge variant="destructive">Due in {days} days</Badge>;
    if (days <= 30) return <Badge className="bg-orange-500">Due in {days} days</Badge>;
    return <Badge variant="secondary">Due in {days} days</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-8 w-8 text-primary" />
          Governance Notifications & Reminders
        </h1>
        <p className="text-muted-foreground">
          Automated alerts for upcoming reviews, policy expirations, and compliance tasks
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Review Schedule</CardTitle>
            <CardDescription>
              Entities requiring formal review and update in the next 90 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isReviewsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : upcomingReviews && upcomingReviews.length > 0 ? (
              <div className="space-y-4">
                {upcomingReviews.map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        {getIcon(review.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{review.name}</p>
                          <Badge variant="outline" className="text-[10px] uppercase">{review.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Review Date: {format(new Date(review.reviewDate), "PPP")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getDaysBadge(review.daysUntil)}
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/${locale}/dashboard/governance/${review.type}s/${review.id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground italic border-2 border-dashed rounded-lg">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                No reviews scheduled for the next 90 days.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase text-muted-foreground tracking-wider">
                Automation Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  90-Day Warning (Internal Prep)
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  60-Day Warning (Stakeholder Draft)
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  30-Day Warning (Final Review)
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  7-Day Critical Alert
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  1-Day Final Reminder
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                * All reminders are sent to the designated owner and creator of the entity via email and in-app notification center.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                Overdue Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {upcomingReviews?.filter(r => r.daysUntil < 0).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Entities with past-due review dates</p>
              <Button variant="link" size="sm" className="px-0 mt-2 h-auto text-xs text-primary" asChild>
                <Link href={`/${locale}/dashboard/governance/audit-logs`}>View Audit Trails</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


