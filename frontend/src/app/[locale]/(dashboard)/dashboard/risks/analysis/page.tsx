"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { risksApi, riskAdvancedApi, Risk, RiskComparisonResponse, WhatIfScenarioResponse, CustomReportResponse, ReportField } from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  GitCompare, 
  FlaskConical, 
  FileBarChart, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp, 
  Minus,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Download,
  X
} from "lucide-react"

// Note: Lazy loading removed for now as components are defined in same file
// Can be re-enabled if components are moved to separate files

export default function RiskAnalysisPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk Analysis Tools</h1>
        <p className="text-muted-foreground mt-1">
          Advanced risk analysis: comparison, what-if scenarios, and custom reports
        </p>
      </div>

      <Tabs defaultValue="compare" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]" role="tablist" aria-label="Risk Analysis Tools">
          <TabsTrigger 
            value="compare" 
            className="flex items-center gap-2"
            aria-label="Compare Risks Tool"
            aria-controls="compare-panel"
            data-testid="risk-analysis-tab-compare"
          >
            <GitCompare className="h-4 w-4" aria-hidden="true" />
            Compare Risks
          </TabsTrigger>
          <TabsTrigger 
            value="whatif" 
            className="flex items-center gap-2"
            aria-label="What-If Analysis Tool"
            aria-controls="whatif-panel"
            data-testid="risk-analysis-tab-whatif"
          >
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            What-If Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="flex items-center gap-2"
            aria-label="Custom Reports Tool"
            aria-controls="reports-panel"
            data-testid="risk-analysis-tab-reports"
          >
            <FileBarChart className="h-4 w-4" aria-hidden="true" />
            Custom Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compare" id="compare-panel" role="tabpanel" aria-labelledby="compare-tab">
          <RiskComparisonToolComponent />
        </TabsContent>

        <TabsContent value="whatif" id="whatif-panel" role="tabpanel" aria-labelledby="whatif-tab">
          <WhatIfAnalysisToolComponent />
        </TabsContent>

        <TabsContent value="reports" id="reports-panel" role="tabpanel" aria-labelledby="reports-tab">
          <CustomReportToolComponent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// =====================
// RISK COMPARISON TOOL
// =====================

function RiskComparisonToolComponent() {
  const [selectedRiskIds, setSelectedRiskIds] = useState<string[]>([])
  const [comparisonResult, setComparisonResult] = useState<RiskComparisonResponse | null>(null)

  // Optimize query with caching and stale time
  const { data: risksData, isLoading: risksLoading } = useQuery({
    queryKey: ['all-risks-for-comparison'],
    queryFn: () => risksApi.getAll({ limit: 100 }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })

  const compareMutation = useMutation({
    mutationFn: (ids: string[]) => riskAdvancedApi.compareRisks(ids),
    onSuccess: (data) => setComparisonResult(data),
  })

  const toggleRiskSelection = (riskId: string) => {
    setSelectedRiskIds(prev => 
      prev.includes(riskId) 
        ? prev.filter(id => id !== riskId)
        : prev.length < 5 ? [...prev, riskId] : prev
    )
  }

  const handleCompare = () => {
    if (selectedRiskIds.length >= 2) {
      compareMutation.mutate(selectedRiskIds)
    }
  }

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="space-y-6" role="region" aria-label="Risk Comparison Tool">
      {/* Risk Selection */}
      <Card>
        <CardHeader>
          <CardTitle id="comparison-title">Select Risks to Compare</CardTitle>
          <CardDescription id="comparison-description">Choose 2-5 risks to compare side-by-side</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4" role="toolbar" aria-label="Comparison actions">
            <Badge variant="outline" className="mr-2" aria-live="polite" aria-atomic="true">
              <span aria-label={`${selectedRiskIds.length} out of 5 risks selected`}>
                {selectedRiskIds.length} / 5 selected
              </span>
            </Badge>
            {selectedRiskIds.length >= 2 && (
              <Button 
                onClick={handleCompare} 
                disabled={compareMutation.isPending}
                aria-label="Compare selected risks"
              >
                {compareMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" /> 
                    <span>Comparing...</span>
                  </>
                ) : (
                  <>
                    <GitCompare className="h-4 w-4 mr-2" aria-hidden="true" /> 
                    Compare Risks
                  </>
                )}
              </Button>
            )}
          </div>

          {risksLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading risks...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
              {risksData?.data.map((risk: Risk) => (
                <div
                  key={risk.id}
                  onClick={() => toggleRiskSelection(risk.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedRiskIds.includes(risk.id)
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm truncate">{risk.title}</div>
                      <div className="text-xs text-muted-foreground">{risk.risk_id}</div>
                    </div>
                    <Badge className={`${getLevelColor(risk.current_risk_level)} text-xs ml-2`}>
                      {risk.current_risk_score || '-'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonResult && (
        <>
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{comparisonResult.summary.total_risks}</div>
                  <div className="text-sm text-muted-foreground">Risks Compared</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{comparisonResult.summary.average_current_score}</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{comparisonResult.summary.average_control_effectiveness}%</div>
                  <div className="text-sm text-muted-foreground">Avg Control Effectiveness</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{comparisonResult.summary.total_active_treatments}</div>
                  <div className="text-sm text-muted-foreground">Active Treatments</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-950/20">
                  <div className="text-sm font-medium text-red-700 dark:text-red-400">Highest Risk</div>
                  <div className="font-bold">{comparisonResult.summary.highest_risk.title}</div>
                  <div className="text-sm">Score: {comparisonResult.summary.highest_risk.score}</div>
                </div>
                <div className="p-4 border rounded-lg border-green-200 bg-green-50 dark:bg-green-950/20">
                  <div className="text-sm font-medium text-green-700 dark:text-green-400">Lowest Risk</div>
                  <div className="font-bold">{comparisonResult.summary.lowest_risk.title}</div>
                  <div className="text-sm">Score: {comparisonResult.summary.lowest_risk.score}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Metric</th>
                      {comparisonResult.risks.map(risk => (
                        <th key={risk.id} className="text-center p-2 min-w-[120px]">
                          <div className="font-medium">{risk.title}</div>
                          <div className="text-xs text-muted-foreground">{risk.risk_id}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonResult.comparison_matrix.map((row, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 font-medium">{row.metric}</td>
                        {row.values.map((val, vidx) => (
                          <td key={vidx} className="text-center p-2">
                            {row.metric === 'Risk Level' ? (
                              <Badge className={getLevelColor(String(val.value))}>
                                {String(val.value)}
                              </Badge>
                            ) : (
                              val.value
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

// =====================
// WHAT-IF ANALYSIS TOOL
// =====================

function WhatIfAnalysisToolComponent() {
  const [selectedRiskId, setSelectedRiskId] = useState<string>('')
  const [likelihood, setLikelihood] = useState<number>(3)
  const [impact, setImpact] = useState<number>(3)
  const [controlEffectiveness, setControlEffectiveness] = useState<number>(0)
  const [additionalControls, setAdditionalControls] = useState<number>(0)
  const [result, setResult] = useState<WhatIfScenarioResponse | null>(null)

  const { data: risksData } = useQuery({
    queryKey: ['all-risks-for-whatif'],
    queryFn: () => risksApi.getAll({ limit: 100 }),
  })

  const whatIfMutation = useMutation({
    mutationFn: () => riskAdvancedApi.simulateWhatIf({
      risk_id: selectedRiskId,
      simulated_likelihood: likelihood,
      simulated_impact: impact,
      simulated_control_effectiveness: controlEffectiveness,
      additional_controls: additionalControls,
    }),
    onSuccess: (data) => setResult(data),
  })

  const selectedRisk = risksData?.data.find((r: Risk) => r.id === selectedRiskId)

  // Load original values when risk is selected
  const handleRiskSelect = (riskId: string) => {
    setSelectedRiskId(riskId)
    const risk = risksData?.data.find((r: Risk) => r.id === riskId)
    if (risk) {
      setLikelihood(risk.current_likelihood || Number(risk.likelihood) || 3)
      setImpact(risk.current_impact || Number(risk.impact) || 3)
      setControlEffectiveness(risk.control_effectiveness || 0)
    }
    setResult(null)
  }

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getLevelBgColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 dark:bg-red-950/30 border-red-200'
      case 'high': return 'bg-orange-100 dark:bg-orange-950/30 border-orange-200'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-950/30 border-yellow-200'
      case 'low': return 'bg-green-100 dark:bg-green-950/30 border-green-200'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="space-y-6" role="region" aria-label="What-If Analysis Tool">
      <Card>
        <CardHeader>
          <CardTitle id="whatif-title">What-If Scenario Analysis</CardTitle>
          <CardDescription id="whatif-description">
            Simulate how changes to likelihood, impact, or controls would affect the risk score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Risk Selection */}
          <div className="space-y-2">
            <Label htmlFor="risk-select" id="risk-select-label">Select a Risk to Analyze</Label>
            <Select value={selectedRiskId} onValueChange={handleRiskSelect}>
              <SelectTrigger 
                id="risk-select"
                aria-labelledby="risk-select-label"
                aria-describedby="risk-select-description"
              >
                <SelectValue placeholder="Choose a risk..." />
              </SelectTrigger>
              <SelectContent role="listbox">
                {risksData?.data.map((risk: Risk) => (
                  <SelectItem key={risk.id} value={risk.id} role="option">
                    {risk.risk_id} - {risk.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p id="risk-select-description" className="sr-only">
              Select a risk from the list to perform what-if analysis
            </p>
          </div>

          {selectedRiskId && (
            <>
              {/* Current Risk Info */}
              {selectedRisk && (
                <div className={`p-4 border rounded-lg ${getLevelBgColor(selectedRisk.current_risk_level)}`}>
                  <div className="font-medium">Current State</div>
                  <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Likelihood</div>
                      <div className="font-bold">{selectedRisk.current_likelihood || selectedRisk.likelihood}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Impact</div>
                      <div className="font-bold">{selectedRisk.current_impact || selectedRisk.impact}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Score</div>
                      <div className="font-bold">{selectedRisk.current_risk_score || '-'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Level</div>
                      <div className={`font-bold capitalize ${getLevelColor(selectedRisk.current_risk_level)}`}>
                        {selectedRisk.current_risk_level || 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Simulation Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="likelihood-slider" id="likelihood-label">
                      Simulated Likelihood: <span aria-live="polite">{likelihood}</span>
                    </Label>
                    <Slider
                      id="likelihood-slider"
                      aria-labelledby="likelihood-label"
                      aria-valuemin={1}
                      aria-valuemax={5}
                      aria-valuenow={likelihood}
                      aria-label={`Likelihood: ${likelihood} out of 5`}
                      value={[likelihood]}
                      onValueChange={(v) => setLikelihood(v[0])}
                      min={1}
                      max={5}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1" role="presentation">
                      <span>Rare</span>
                      <span>Almost Certain</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="impact-slider" id="impact-label">
                      Simulated Impact: <span aria-live="polite">{impact}</span>
                    </Label>
                    <Slider
                      id="impact-slider"
                      aria-labelledby="impact-label"
                      aria-valuemin={1}
                      aria-valuemax={5}
                      aria-valuenow={impact}
                      aria-label={`Impact: ${impact} out of 5`}
                      value={[impact]}
                      onValueChange={(v) => setImpact(v[0])}
                      min={1}
                      max={5}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1" role="presentation">
                      <span>Negligible</span>
                      <span>Catastrophic</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Control Effectiveness: {controlEffectiveness}%</Label>
                    <Slider
                      value={[controlEffectiveness]}
                      onValueChange={(v) => setControlEffectiveness(v[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Additional Controls: +{additionalControls}</Label>
                    <Slider
                      value={[additionalControls]}
                      onValueChange={(v) => setAdditionalControls(v[0])}
                      min={0}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Each control adds ~10% effectiveness
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => whatIfMutation.mutate()} 
                disabled={whatIfMutation.isPending}
                className="w-full"
                aria-label="Run what-if scenario analysis"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!whatIfMutation.isPending) {
                      whatIfMutation.mutate();
                    }
                  }
                }}
              >
                {whatIfMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" /> 
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <FlaskConical className="h-4 w-4 mr-2" aria-hidden="true" /> 
                    Run What-If Analysis
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Before/After Comparison */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className={`p-4 border rounded-lg text-center ${getLevelBgColor(result.original.risk_level)}`}>
                <div className="text-sm font-medium text-muted-foreground mb-2">Original</div>
                <div className="text-3xl font-bold">{result.original.risk_score}</div>
                <div className={`font-medium capitalize ${getLevelColor(result.original.risk_level)}`}>
                  {result.original.risk_level}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <ArrowRight className="h-8 w-8 text-muted-foreground" />
                  {result.impact_analysis.score_change !== 0 && (
                    <Badge 
                      variant={result.impact_analysis.score_change < 0 ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {result.impact_analysis.score_change < 0 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      {result.impact_analysis.score_change_percentage}%
                    </Badge>
                  )}
                </div>
              </div>

              <div className={`p-4 border rounded-lg text-center ${getLevelBgColor(result.simulated.risk_level)}`}>
                <div className="text-sm font-medium text-muted-foreground mb-2">Simulated</div>
                <div className="text-3xl font-bold">{result.simulated.risk_score}</div>
                <div className={`font-medium capitalize ${getLevelColor(result.simulated.risk_level)}`}>
                  {result.simulated.risk_level}
                </div>
              </div>
            </div>

            {/* Impact Analysis */}
            <div className="space-y-4">
              <h4 className="font-medium">Impact Analysis</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Score Change</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      {result.impact_analysis.score_change > 0 ? '+' : ''}{result.impact_analysis.score_change}
                    </span>
                    {result.impact_analysis.score_change < 0 ? (
                      <ArrowDown className="h-5 w-5 text-green-500" />
                    ) : result.impact_analysis.score_change > 0 ? (
                      <ArrowUp className="h-5 w-5 text-red-500" />
                    ) : (
                      <Minus className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Level Changed</div>
                  <div className="flex items-center gap-2">
                    {result.impact_analysis.level_changed ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                        <span>{result.impact_analysis.old_level} → {result.impact_analysis.new_level}</span>
                      </>
                    ) : (
                      <>
                        <Minus className="h-5 w-5 text-gray-500" />
                        <span>No change</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Risk Appetite Warning */}
              {result.impact_analysis.exceeds_appetite && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-700 dark:text-red-400">Exceeds Risk Appetite</div>
                    <div className="text-sm text-red-600 dark:text-red-300">
                      Score of {result.simulated.risk_score} exceeds the threshold of {result.impact_analysis.appetite_threshold}
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">Recommendation</div>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  {result.impact_analysis.recommendation}
                </p>
              </div>

              {/* Risk Level Details */}
              {result.risk_level_details && (
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Simulated Risk Level Details</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Response Time</div>
                      <div className="font-medium">{result.risk_level_details.response_time}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Requires Escalation</div>
                      <div className="font-medium">{result.risk_level_details.requires_escalation ? 'Yes' : 'No'}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Description</div>
                      <div className="font-medium">{result.risk_level_details.description}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// =====================
// CUSTOM REPORT TOOL
// =====================

function CustomReportToolComponent() {
  const [reportName, setReportName] = useState("Custom Risk Report")
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'risk_id', 'title', 'current_risk_score', 'current_risk_level', 'status', 'owner_name'
  ])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [exceedsAppetiteOnly, setExceedsAppetiteOnly] = useState(false)
  const [groupBy, setGroupBy] = useState<string>('')
  const [includeSummary, setIncludeSummary] = useState(true)
  const [report, setReport] = useState<CustomReportResponse | null>(null)

  // Optimize query with caching
  const { data: availableFields } = useQuery({
    queryKey: ['report-fields'],
    queryFn: () => riskAdvancedApi.getReportFields(),
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes (fields don't change often)
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
  })
  
  // Memoize fields by category for performance
  const fieldsByCategory = useMemo(() => {
    if (!availableFields) return {};
    return availableFields.reduce((acc, field) => {
      if (!acc[field.category]) acc[field.category] = [];
      acc[field.category].push(field);
      return acc;
    }, {} as Record<string, ReportField[]>);
  }, [availableFields]);

  const generateMutation = useMutation({
    mutationFn: () => riskAdvancedApi.generateReport({
      name: reportName,
      fields: selectedFields,
      risk_levels: selectedLevels.length > 0 ? selectedLevels : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      exceeds_appetite_only: exceedsAppetiteOnly,
      group_by: groupBy || undefined,
      include_summary: includeSummary,
      sort_by: 'current_risk_score',
      sort_direction: 'DESC',
    }),
    onSuccess: (data) => setReport(data),
  })

  const toggleField = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    )
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const downloadReport = () => {
    if (!report) return
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.report_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6" role="region" aria-label="Custom Report Builder">
      <Card>
        <CardHeader>
          <CardTitle id="report-title">Custom Report Builder</CardTitle>
          <CardDescription id="report-description">
            Create customized risk reports with your selected fields and filters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Name */}
          <div className="space-y-2">
            <Label>Report Name</Label>
            <Input 
              value={reportName} 
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter report name..."
            />
          </div>

          {/* Field Selection */}
          <div className="space-y-4">
            <Label>Select Fields to Include</Label>
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              role="group"
              aria-labelledby="report-title"
              aria-describedby="report-description"
            >
              {Object.entries(fieldsByCategory).map(([category, fields]) => (
                <div key={category} className="border rounded-lg p-3" role="group" aria-label={`${category} fields`}>
                  <div className="font-medium text-sm mb-2">{category}</div>
                  <div className="space-y-2" role="list">
                    {fields.map((field) => (
                      <div key={field.field} className="flex items-center space-x-2" role="listitem">
                        <Checkbox
                          id={field.field}
                          checked={selectedFields.includes(field.field)}
                          onCheckedChange={() => toggleField(field.field)}
                          aria-label={`Include ${field.label} field in report`}
                        />
                        <label htmlFor={field.field} className="text-sm cursor-pointer">
                          {field.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Filter by Risk Level</Label>
              <div className="flex flex-wrap gap-2">
                {['critical', 'high', 'medium', 'low'].map((level) => (
                  <Badge
                    key={level}
                    variant={selectedLevels.includes(level) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleLevel(level)}
                  >
                    {selectedLevels.includes(level) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {level}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <div className="flex flex-wrap gap-2">
                {['identified', 'assessed', 'mitigated', 'accepted', 'closed'].map((status) => (
                  <Badge
                    key={status}
                    variant={selectedStatuses.includes(status) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleStatus(status)}
                  >
                    {selectedStatuses.includes(status) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="exceeds-appetite"
                checked={exceedsAppetiteOnly}
                onCheckedChange={(checked) => setExceedsAppetiteOnly(!!checked)}
              />
              <label htmlFor="exceeds-appetite" className="text-sm cursor-pointer">
                Only risks exceeding appetite
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-summary"
                checked={includeSummary}
                onCheckedChange={(checked) => setIncludeSummary(!!checked)}
              />
              <label htmlFor="include-summary" className="text-sm cursor-pointer">
                Include summary statistics
              </label>
            </div>

            <div className="space-y-2">
              <Label>Group By</Label>
              <Select value={groupBy || "none"} onValueChange={(val) => setGroupBy(val === "none" ? "" : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="No grouping" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No grouping</SelectItem>
                  <SelectItem value="current_risk_level">Risk Level</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="category_name">Category</SelectItem>
                  <SelectItem value="owner_name">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={() => generateMutation.mutate()} 
            disabled={generateMutation.isPending || selectedFields.length === 0}
            className="w-full"
            aria-label="Generate custom risk report"
            aria-describedby={selectedFields.length === 0 ? "field-selection-required" : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!generateMutation.isPending && selectedFields.length > 0) {
                  generateMutation.mutate();
                }
              }
            }}
          >
            {generateMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" /> 
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileBarChart className="h-4 w-4 mr-2" aria-hidden="true" /> 
                Generate Report
              </>
            )}
          </Button>
          {selectedFields.length === 0 && (
            <p id="field-selection-required" className="text-sm text-muted-foreground text-center mt-2" role="alert">
              Please select at least one field to include in the report
            </p>
          )}
        </CardContent>
      </Card>

      {/* Report Results */}
      {report && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{report.report_name}</CardTitle>
                <CardDescription>Generated: {new Date(report.generated_at).toLocaleString()}</CardDescription>
              </div>
              <Button variant="outline" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-2" /> Download JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            {report.summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{report.summary.total_risks}</div>
                  <div className="text-sm text-muted-foreground">Total Risks</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{report.summary.average_score}</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{report.summary.max_score}</div>
                  <div className="text-sm text-muted-foreground">Max Score</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{report.summary.min_score}</div>
                  <div className="text-sm text-muted-foreground">Min Score</div>
                </div>
              </div>
            )}

            {/* Data Table */}
            {report.grouped_data ? (
              // Grouped view
              <div className="space-y-4">
                {Object.entries(report.grouped_data).map(([group, items]) => (
                  <div key={group} className="border rounded-lg">
                    <div className="p-3 bg-muted font-medium">{group} ({items.length})</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {selectedFields.map(field => (
                              <th key={field} className="text-left p-2">
                                {availableFields?.find(f => f.field === field)?.label || field}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b">
                              {selectedFields.map(field => (
                                <td key={field} className="p-2">
                                  {item[field] ?? '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Flat view
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {selectedFields.map(field => (
                        <th key={field} className="text-left p-2">
                          {availableFields?.find(f => f.field === field)?.label || field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.data.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        {selectedFields.map(field => (
                          <td key={field} className="p-2">
                            {item[field] ?? '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

