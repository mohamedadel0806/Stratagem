"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Settings, 
  Shield, 
  Target, 
  Calculator, 
  FileText,
  Info,
  AlertTriangle,
  CheckCircle2,
  Save,
  RotateCcw,
  HelpCircle,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  riskSettingsApi,
  RiskSettings,
  RiskLevelConfig,
  AssessmentMethodConfig,
  ScaleDescription,
  UpdateRiskSettingsData,
} from "@/lib/api/risks"

// Default configurations (used as fallback)
const DEFAULT_RISK_LEVELS: RiskLevelConfig[] = [
  { level: 'Low', minScore: 1, maxScore: 5, color: '#22c55e', description: 'Acceptable risk - monitor periodically', responseTime: '90 days', escalation: false },
  { level: 'Medium', minScore: 6, maxScore: 11, color: '#eab308', description: 'Moderate risk - implement controls', responseTime: '30 days', escalation: false },
  { level: 'High', minScore: 12, maxScore: 19, color: '#f97316', description: 'Significant risk - prioritize treatment', responseTime: '7 days', escalation: true },
  { level: 'Critical', minScore: 20, maxScore: 25, color: '#dc2626', description: 'Unacceptable risk - immediate action required', responseTime: '24 hours', escalation: true },
]

const DEFAULT_ASSESSMENT_METHODS: AssessmentMethodConfig[] = [
  { id: 'qualitative_5x5', name: 'Qualitative 5x5 Matrix', description: 'Standard 5-point scales for likelihood and impact', likelihoodScale: 5, impactScale: 5, isDefault: true, isActive: true },
  { id: 'qualitative_3x3', name: 'Simplified 3x3 Matrix', description: 'Basic 3-point scales for quick assessments', likelihoodScale: 3, impactScale: 3, isDefault: false, isActive: true },
  { id: 'bowtie', name: 'Bowtie Analysis', description: 'Cause-consequence analysis with barriers', likelihoodScale: 5, impactScale: 5, isDefault: false, isActive: false },
]

const DEFAULT_LIKELIHOOD: ScaleDescription[] = [
  { value: 1, label: 'Rare', description: 'Highly unlikely to occur (< 5% chance)' },
  { value: 2, label: 'Unlikely', description: 'Not expected but possible (5-20% chance)' },
  { value: 3, label: 'Possible', description: 'Could occur at some point (20-50% chance)' },
  { value: 4, label: 'Likely', description: 'More likely than not (50-80% chance)' },
  { value: 5, label: 'Almost Certain', description: 'Expected to occur (> 80% chance)' },
]

const DEFAULT_IMPACT: ScaleDescription[] = [
  { value: 1, label: 'Negligible', description: 'Minimal impact on operations or objectives' },
  { value: 2, label: 'Minor', description: 'Limited impact, easily recoverable' },
  { value: 3, label: 'Moderate', description: 'Noticeable impact requiring management attention' },
  { value: 4, label: 'Major', description: 'Significant impact on key objectives' },
  { value: 5, label: 'Catastrophic', description: 'Severe impact threatening organizational survival' },
]

export default function RiskSettingsPage() {
  const params = useParams()
  const locale = params?.locale || 'en'
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch settings from API
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['riskSettings'],
    queryFn: riskSettingsApi.getSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // State for local edits
  const [riskLevels, setRiskLevels] = useState<RiskLevelConfig[]>(DEFAULT_RISK_LEVELS)
  const [assessmentMethods, setAssessmentMethods] = useState<AssessmentMethodConfig[]>(DEFAULT_ASSESSMENT_METHODS)
  const [likelihoodDescriptions, setLikelihoodDescriptions] = useState<ScaleDescription[]>(DEFAULT_LIKELIHOOD)
  const [impactDescriptions, setImpactDescriptions] = useState<ScaleDescription[]>(DEFAULT_IMPACT)
  const [hasChanges, setHasChanges] = useState(false)

  // Global settings state
  const [globalSettings, setGlobalSettings] = useState({
    defaultReviewPeriodDays: 90,
    autoCalculateRiskScore: true,
    requireAssessmentEvidence: false,
    enableRiskAppetite: true,
    defaultAssessmentMethod: 'qualitative_5x5',
    notifyOnHighRisk: true,
    notifyOnCriticalRisk: true,
    notifyOnReviewDue: true,
    reviewReminderDays: 7,
    maxAcceptableRiskScore: 11,
    riskAcceptanceAuthority: 'executive',
  })

  // Sync state when settings load from API
  useEffect(() => {
    if (settings) {
      setRiskLevels(settings.risk_levels || DEFAULT_RISK_LEVELS)
      setAssessmentMethods(settings.assessment_methods || DEFAULT_ASSESSMENT_METHODS)
      setLikelihoodDescriptions(settings.likelihood_scale || DEFAULT_LIKELIHOOD)
      setImpactDescriptions(settings.impact_scale || DEFAULT_IMPACT)
      setGlobalSettings({
        defaultReviewPeriodDays: settings.default_review_period_days || 90,
        autoCalculateRiskScore: settings.auto_calculate_risk_score ?? true,
        requireAssessmentEvidence: settings.require_assessment_evidence ?? false,
        enableRiskAppetite: settings.enable_risk_appetite ?? true,
        defaultAssessmentMethod: settings.default_assessment_method || 'qualitative_5x5',
        notifyOnHighRisk: settings.notify_on_high_risk ?? true,
        notifyOnCriticalRisk: settings.notify_on_critical_risk ?? true,
        notifyOnReviewDue: settings.notify_on_review_due ?? true,
        reviewReminderDays: settings.review_reminder_days || 7,
        maxAcceptableRiskScore: settings.max_acceptable_risk_score || 11,
        riskAcceptanceAuthority: settings.risk_acceptance_authority || 'executive',
      })
      setHasChanges(false)
    }
  }, [settings])

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: (data: UpdateRiskSettingsData) => riskSettingsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskSettings'] })
      toast({
        title: "Settings saved",
        description: "Risk configuration has been updated successfully.",
      })
      setHasChanges(false)
    },
    onError: (error: any) => {
      toast({
        title: "Error saving settings",
        description: error.message || "Failed to save risk configuration.",
        variant: "destructive",
      })
    },
  })

  // Reset to defaults mutation
  const resetMutation = useMutation({
    mutationFn: () => riskSettingsApi.resetToDefaults(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskSettings'] })
      toast({
        title: "Settings reset",
        description: "Risk configuration has been reset to defaults.",
      })
      setHasChanges(false)
    },
    onError: (error: any) => {
      toast({
        title: "Error resetting settings",
        description: error.message || "Failed to reset risk configuration.",
        variant: "destructive",
      })
    },
  })

  const handleRiskLevelChange = (index: number, field: keyof RiskLevelConfig, value: any) => {
    const updated = [...riskLevels]
    updated[index] = { ...updated[index], [field]: value }
    setRiskLevels(updated)
    setHasChanges(true)
  }

  const handleGlobalSettingChange = (field: string, value: any) => {
    setGlobalSettings(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSaveSettings = () => {
    const updateData: UpdateRiskSettingsData = {
      risk_levels: riskLevels,
      assessment_methods: assessmentMethods,
      likelihood_scale: likelihoodDescriptions,
      impact_scale: impactDescriptions,
      default_review_period_days: globalSettings.defaultReviewPeriodDays,
      auto_calculate_risk_score: globalSettings.autoCalculateRiskScore,
      require_assessment_evidence: globalSettings.requireAssessmentEvidence,
      enable_risk_appetite: globalSettings.enableRiskAppetite,
      default_assessment_method: globalSettings.defaultAssessmentMethod,
      notify_on_high_risk: globalSettings.notifyOnHighRisk,
      notify_on_critical_risk: globalSettings.notifyOnCriticalRisk,
      notify_on_review_due: globalSettings.notifyOnReviewDue,
      review_reminder_days: globalSettings.reviewReminderDays,
      max_acceptable_risk_score: globalSettings.maxAcceptableRiskScore,
      risk_acceptance_authority: globalSettings.riskAcceptanceAuthority,
    }
    saveMutation.mutate(updateData)
  }

  const handleResetToDefaults = () => {
    resetMutation.mutate()
  }

  const getRiskLevelColor = (score: number) => {
    if (score >= 20) return 'bg-red-500'
    if (score >= 12) return 'bg-orange-500'
    if (score >= 6) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Failed to Load Settings
            </CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'An error occurred while loading risk settings.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['riskSettings'] })}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Risk Configuration
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure risk assessment methodology, scoring, and organizational settings
            {settings?.version && (
              <Badge variant="outline" className="ml-2">v{settings.version}</Badge>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleResetToDefaults}
            disabled={resetMutation.isPending}
            data-testid="risk-settings-reset-button"
          >
            {resetMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="mr-2 h-4 w-4" />
            )}
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            disabled={!hasChanges || saveMutation.isPending}
            data-testid="risk-settings-save-button"
          >
            {saveMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <span className="text-amber-800 dark:text-amber-200">You have unsaved changes</span>
        </div>
      )}

      <Tabs defaultValue="scoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scoring" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Risk Scoring
          </TabsTrigger>
          <TabsTrigger value="levels" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Risk Levels
          </TabsTrigger>
          <TabsTrigger value="scales" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Assessment Scales
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General Settings
          </TabsTrigger>
        </TabsList>

        {/* Risk Scoring Matrix Tab */}
        <TabsContent value="scoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Risk Scoring Matrix
              </CardTitle>
              <CardDescription>
                Visual representation of risk scores based on likelihood and impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 5x5 Risk Matrix */}
              <div className="flex flex-col items-center">
                <div className="flex items-end mb-2">
                  <div className="w-24 text-right pr-4 text-sm font-medium text-muted-foreground">
                    Likelihood
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(impact => (
                      <div key={impact} className="w-16 text-center text-xs text-muted-foreground">
                        {impact}
                      </div>
                    ))}
                  </div>
                </div>
                
                {[5, 4, 3, 2, 1].map(likelihood => (
                  <div key={likelihood} className="flex items-center">
                    <div className="w-24 text-right pr-4 text-sm font-medium">
                      {likelihood}
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(impact => {
                        const score = likelihood * impact
                        return (
                          <TooltipProvider key={`${likelihood}-${impact}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "w-16 h-12 rounded flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition-opacity",
                                    getRiskLevelColor(score)
                                  )}
                                >
                                  {score}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Likelihood: {likelihood}, Impact: {impact}</p>
                                <p>Score: {score}</p>
                                <p>Level: {score >= 20 ? 'Critical' : score >= 12 ? 'High' : score >= 6 ? 'Medium' : 'Low'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )
                      })}
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center mt-4">
                  <div className="w-24" />
                  <div className="text-sm font-medium text-muted-foreground">Impact →</div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium mb-3">Risk Level Legend</h4>
                <div className="flex flex-wrap gap-4">
                  {riskLevels.map(level => (
                    <div key={level.level} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: level.color }}
                      />
                      <span className="text-sm">
                        {level.level} ({level.minScore}-{level.maxScore})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Methods</CardTitle>
              <CardDescription>
                Configure available risk assessment methodologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Scale</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessmentMethods.map((method, index) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium">{method.name}</TableCell>
                      <TableCell className="text-muted-foreground">{method.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {method.likelihoodScale}x{method.impactScale}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={method.isDefault}
                          onCheckedChange={(checked) => {
                            const updated = assessmentMethods.map((m, i) => ({
                              ...m,
                              isDefault: i === index ? checked : false
                            }))
                            setAssessmentMethods(updated)
                            setHasChanges(true)
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={method.isActive}
                          onCheckedChange={(checked) => {
                            const updated = [...assessmentMethods]
                            updated[index] = { ...updated[index], isActive: checked }
                            setAssessmentMethods(updated)
                            setHasChanges(true)
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Levels Configuration Tab */}
        <TabsContent value="levels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Risk Level Thresholds
              </CardTitle>
              <CardDescription>
                Configure score thresholds and response requirements for each risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead>Score Range</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Escalation</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riskLevels.map((level, index) => (
                    <TableRow key={level.level}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: level.color }}
                          />
                          <span className="font-medium">{level.level}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={level.minScore}
                            onChange={(e) => handleRiskLevelChange(index, 'minScore', parseInt(e.target.value))}
                            className="w-16 h-8"
                            min={1}
                            max={25}
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            value={level.maxScore}
                            onChange={(e) => handleRiskLevelChange(index, 'maxScore', parseInt(e.target.value))}
                            className="w-16 h-8"
                            min={1}
                            max={25}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="color"
                          value={level.color}
                          onChange={(e) => handleRiskLevelChange(index, 'color', e.target.value)}
                          className="w-12 h-8 p-1 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={level.responseTime}
                          onChange={(e) => handleRiskLevelChange(index, 'responseTime', e.target.value)}
                          className="w-28 h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={level.escalation}
                          onCheckedChange={(checked) => handleRiskLevelChange(index, 'escalation', checked)}
                        />
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <Input
                          value={level.description}
                          onChange={(e) => handleRiskLevelChange(index, 'description', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Risk Appetite Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Organizational Risk Appetite
              </CardTitle>
              <CardDescription>
                Define the organization's tolerance for different risk levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Maximum Acceptable Risk Score</Label>
                  <Select defaultValue="11">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 (Low risks only)</SelectItem>
                      <SelectItem value="11">11 (Up to Medium risks)</SelectItem>
                      <SelectItem value="19">19 (Up to High risks)</SelectItem>
                      <SelectItem value="25">25 (All risks accepted)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Risks above this score require mandatory treatment
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Risk Acceptance Authority</Label>
                  <Select defaultValue="executive">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Department Manager</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="executive">Executive/C-Level</SelectItem>
                      <SelectItem value="board">Board Approval</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Who can approve risk acceptance decisions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment Scales Tab */}
        <TabsContent value="scales" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Likelihood Scale */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Likelihood Scale
                </CardTitle>
                <CardDescription>
                  Define probability descriptions for each likelihood level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {likelihoodDescriptions.map((item, index) => (
                    <div key={item.value} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono">
                          Level {item.value}
                        </Badge>
                        <Input
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...likelihoodDescriptions]
                            updated[index] = { ...updated[index], label: e.target.value }
                            setLikelihoodDescriptions(updated)
                            setHasChanges(true)
                          }}
                          className="w-32 h-8"
                        />
                      </div>
                      <Textarea
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...likelihoodDescriptions]
                          updated[index] = { ...updated[index], description: e.target.value }
                          setLikelihoodDescriptions(updated)
                          setHasChanges(true)
                        }}
                        className="text-sm resize-none"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Impact Scale */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Impact Scale
                </CardTitle>
                <CardDescription>
                  Define severity descriptions for each impact level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactDescriptions.map((item, index) => (
                    <div key={item.value} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono">
                          Level {item.value}
                        </Badge>
                        <Input
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...impactDescriptions]
                            updated[index] = { ...updated[index], label: e.target.value }
                            setImpactDescriptions(updated)
                            setHasChanges(true)
                          }}
                          className="w-32 h-8"
                        />
                      </div>
                      <Textarea
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...impactDescriptions]
                          updated[index] = { ...updated[index], description: e.target.value }
                          setImpactDescriptions(updated)
                          setHasChanges(true)
                        }}
                        className="text-sm resize-none"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Review & Assessment Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Review & Assessment</CardTitle>
                <CardDescription>
                  Configure default review periods and assessment requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Review Period (Days)</Label>
                  <Input
                    type="number"
                    value={globalSettings.defaultReviewPeriodDays}
                    onChange={(e) => handleGlobalSettingChange('defaultReviewPeriodDays', parseInt(e.target.value))}
                    min={7}
                    max={365}
                  />
                  <p className="text-xs text-muted-foreground">
                    How often risks should be reviewed by default
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Calculate Risk Score</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically calculate score from likelihood × impact
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.autoCalculateRiskScore}
                    onCheckedChange={(checked) => handleGlobalSettingChange('autoCalculateRiskScore', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Assessment Evidence</Label>
                    <p className="text-xs text-muted-foreground">
                      Require evidence attachment for risk assessments
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.requireAssessmentEvidence}
                    onCheckedChange={(checked) => handleGlobalSettingChange('requireAssessmentEvidence', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Assessment Method</Label>
                  <Select 
                    value={globalSettings.defaultAssessmentMethod}
                    onValueChange={(value) => handleGlobalSettingChange('defaultAssessmentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assessmentMethods.filter(m => m.isActive).map(method => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications & Alerts</CardTitle>
                <CardDescription>
                  Configure when to send risk-related notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Risk Appetite Tracking</Label>
                    <p className="text-xs text-muted-foreground">
                      Track and alert on risk appetite breaches
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.enableRiskAppetite}
                    onCheckedChange={(checked) => handleGlobalSettingChange('enableRiskAppetite', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notify on High Risk</Label>
                    <p className="text-xs text-muted-foreground">
                      Send notifications when risks reach High level
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.notifyOnHighRisk}
                    onCheckedChange={(checked) => handleGlobalSettingChange('notifyOnHighRisk', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notify on Critical Risk</Label>
                    <p className="text-xs text-muted-foreground">
                      Send notifications when risks reach Critical level
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.notifyOnCriticalRisk}
                    onCheckedChange={(checked) => handleGlobalSettingChange('notifyOnCriticalRisk', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Related Configuration</CardTitle>
              <CardDescription>
                Other risk management configuration areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start text-left"
                  onClick={() => router.push(`/${locale}/dashboard/risks/categories`)}
                >
                  <Shield className="h-6 w-6 mb-2 text-primary" />
                  <span className="font-medium">Risk Categories</span>
                  <span className="text-xs text-muted-foreground">
                    Manage risk category hierarchy
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start text-left"
                  onClick={() => router.push(`/${locale}/dashboard/risks/kris`)}
                >
                  <Target className="h-6 w-6 mb-2 text-primary" />
                  <span className="font-medium">Key Risk Indicators</span>
                  <span className="text-xs text-muted-foreground">
                    Configure KRI thresholds
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start text-left"
                  onClick={() => router.push(`/${locale}/dashboard/risks/treatments`)}
                >
                  <FileText className="h-6 w-6 mb-2 text-primary" />
                  <span className="font-medium">Treatment Templates</span>
                  <span className="text-xs text-muted-foreground">
                    Manage treatment plan templates
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

