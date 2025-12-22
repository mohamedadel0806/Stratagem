"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  governanceApi,
  governanceDashboardApi,
  UnifiedControl,
} from "@/lib/api/governance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Loader2,
  Calendar,
  Shield,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Activity,
  Sparkles,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { format, parseISO, subDays } from "date-fns";

export default function ControlEffectivenessTrendsPage() {
  const [selectedControlId, setSelectedControlId] = useState<string>("all");
  const [rangeDays, setRangeDays] = useState<number>(90);
  const [showAI, setShowAI] = useState(false);

  const { data: controlsData } = useQuery({
    queryKey: ["unified-controls-for-trends"],
    queryFn: () => governanceApi.getUnifiedControls({ limit: 500 }),
  });

  const { data: trendData = [], isLoading } = useQuery({
    queryKey: ["control-effectiveness-trends", selectedControlId, rangeDays],
    queryFn: () => governanceDashboardApi.getEffectivenessTrends(
      selectedControlId === "all" ? undefined : selectedControlId,
      rangeDays
    ),
  });

  const { data: aiPrediction, isFetching: isAILoading, refetch: getAIPrediction } = useQuery({
    queryKey: ["ai-prediction", selectedControlId],
    queryFn: () => governanceApi.predictControlEffectiveness(selectedControlId),
    enabled: false,
  });

  const controls = controlsData?.data || [];

  const combinedData = useMemo(() => {
    if (!aiPrediction || !showAI) return trendData;
    
    // Combine historical data with forecast
    const forecast = aiPrediction.forecast.map(f => ({
      date: f.date,
      score: null,
      forecast: f.score
    }));

    const historical = trendData.map(h => ({
      ...h,
      forecast: null
    }));

    // Bridge the gap - last historical point should be the start of forecast
    if (historical.length > 0 && forecast.length > 0) {
      historical[historical.length - 1].forecast = historical[historical.length - 1].score;
    }

    return [...historical, ...forecast];
  }, [trendData, aiPrediction, showAI]);

  const stats = useMemo(() => {
    if (trendData.length < 2) return { current: 0, change: 0, trend: 'stable' as const };
    
    const current = trendData[trendData.length - 1].score;
    const previous = trendData[trendData.length - 2].score;
    const change = Math.round((current - previous) * 10) / 10;
    
    return {
      current,
      change,
      trend: change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable'
    };
  }, [trendData]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Control Effectiveness Trends
          </h1>
          <p className="text-muted-foreground">
            Analyze historical performance and stability of internal controls
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={showAI ? "default" : "outline"} 
            className={`gap-2 ${showAI ? 'bg-primary shadow-md' : 'border-primary/30 text-primary'}`}
            disabled={selectedControlId === "all" || isAILoading}
            onClick={() => {
              if (!showAI) getAIPrediction();
              setShowAI(!showAI);
            }}
          >
            {isAILoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {showAI ? "Hide AI Insights" : "Predict Future Performance"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Focus Control</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Select value={selectedControlId} onValueChange={setSelectedControlId}>
              <SelectTrigger>
                <SelectValue placeholder="All Controls (Aggregate)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Global Average (All Controls)</SelectItem>
                {controls.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.control_identifier}: {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Time Horizon</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Select value={String(rangeDays)} onValueChange={(val) => setRangeDays(Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="180">Last 6 Months</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Current Status</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.current}%</p>
                <p className="text-[10px] text-muted-foreground uppercase">Average Score</p>
              </div>
              <div className="text-right">
                <Badge 
                  variant={stats.trend === 'improving' ? 'default' : stats.trend === 'declining' ? 'destructive' : 'secondary'}
                  className="flex items-center gap-1"
                >
                  {stats.trend === 'improving' ? <ArrowUpRight className="h-3 w-3" /> : 
                   stats.trend === 'declining' ? <ArrowDownRight className="h-3 w-3" /> : 
                   <Minus className="h-3 w-3" />}
                  {Math.abs(stats.change)}%
                </Badge>
                <p className="text-[10px] text-muted-foreground uppercase mt-1">Vs. Previous</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b bg-muted/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historical Effectiveness Curve</CardTitle>
              <CardDescription>
                Testing results and validation outcomes over time
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full bg-primary" />
                Actual Score
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Calculating historical trend...</p>
            </div>
          ) : trendData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground border-2 border-dashed rounded-lg">
              <Shield className="h-12 w-12 mb-4 opacity-20" />
              <p>No testing data available for the selected criteria.</p>
              <p className="text-xs mt-1 text-center max-w-xs">
                Historical trends require completed control tests with quantitative effectiveness scores.
              </p>
            </div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(str) => format(parseISO(str), "MMM d")}
                    tick={{ fontSize: 11 }}
                    minTickGap={30}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip 
                    labelFormatter={(label) => format(parseISO(label), "MMMM d, yyyy")}
                    formatter={(value: any, name: string) => [
                      `${value}%`, 
                      name === 'score' ? "Actual Effectiveness" : "AI Forecast"
                    ]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={1500}
                  />
                  {showAI && (
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4, strokeWidth: 2 }}
                      animationDuration={2000}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {showAI && aiPrediction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Card className="border-primary/20 bg-primary/5 shadow-inner">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                AI Forecast Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-relaxed text-muted-foreground italic">
                "{aiPrediction.reasoning}"
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Predicted Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {aiPrediction.riskWarnings.map((warning, i) => (
                  <li key={i} className="text-[10px] text-red-700 flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Analysis Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Moving Averages</p>
                <p className="text-xs text-muted-foreground">Data is aggregated by test date. If multiple tests occurred on the same day, the average score is displayed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-md">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Rolling Window</p>
                <p className="text-xs text-muted-foreground">Adjust the time horizon to identify seasonal fluctuations or long-term degradation in control performance.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Threshold Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded-md">
              <span className="text-xs font-medium">Critical Threshold ({"<"} 50%)</span>
              <Badge variant="destructive">Manual Review</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-md">
              <span className="text-xs font-medium">Target Performance ({">"} 85%)</span>
              <Badge className="bg-green-500">Satisfactory</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-md">
              <span className="text-xs font-medium">Volatility Alert</span>
              <Badge variant="outline">±15% Deviation</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


