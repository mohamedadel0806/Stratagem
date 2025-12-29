"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Database,
    Shield,
    Server,
    Building2,
    ChevronRight,
    Globe,
    Lock
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { riskCategoriesApi } from "@/lib/api/risks"
import { assetTypesApi } from "@/lib/api/assets"
import { businessUnitsApi } from "@/lib/api/business-units"
import { RiskCategoryForm } from "@/components/forms/risk-category-form"
import { AssetTypeForm } from "@/components/forms/asset-type-form"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { BusinessUnitForm } from "@/components/forms/business-unit-form"
import { ControlDomainForm } from "@/components/forms/control-domain-form"
import { StandardForm } from "@/components/forms/standard-form"
import { governanceApi } from "@/lib/api/governance"

export function LookupsManagement() {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [activeTab, setActiveTab] = useState("risk-categories")
    const [searchQuery, setSearchQuery] = useState("")

    // Asset Type state
    const [isAssetTypeFormOpen, setIsAssetTypeFormOpen] = useState(false)
    const [editingAssetType, setEditingAssetType] = useState<any>(null)
    const [deletingAssetTypeId, setDeletingAssetTypeId] = useState<string | null>(null)

    // Risk Category state
    const [isRiskCategoryFormOpen, setIsRiskCategoryFormOpen] = useState(false)
    const [editingRiskCategory, setEditingRiskCategory] = useState<any>(null)
    const [deletingRiskCategoryId, setDeletingRiskCategoryId] = useState<string | null>(null)

    // Business Unit state
    const [isBusinessUnitFormOpen, setIsBusinessUnitFormOpen] = useState(false)
    const [editingBusinessUnit, setEditingBusinessUnit] = useState<any>(null)
    const [deletingBusinessUnitId, setDeletingBusinessUnitId] = useState<string | null>(null)

    // Control Domain state
    const [isControlDomainFormOpen, setIsControlDomainFormOpen] = useState(false)
    const [editingControlDomain, setEditingControlDomain] = useState<any>(null)
    const [deletingControlDomainId, setDeletingControlDomainId] = useState<string | null>(null)

    // Standard state
    const [isStandardFormOpen, setIsStandardFormOpen] = useState(false)
    const [editingStandard, setEditingStandard] = useState<any>(null)
    const [deletingStandardId, setDeletingStandardId] = useState<string | null>(null)

    const deleteAssetTypeMutation = useMutation({
        mutationFn: (id: string) => assetTypesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asset-types"] })
            toast({ title: "Success", description: "Asset type deleted successfully" })
            setDeletingAssetTypeId(null)
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete asset type",
                variant: "destructive"
            })
            setDeletingAssetTypeId(null)
        }
    })

    const deleteRiskCategoryMutation = useMutation({
        mutationFn: (id: string) => riskCategoriesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["risk-categories"] })
            toast({ title: "Success", description: "Risk category deleted successfully" })
            setDeletingRiskCategoryId(null)
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete risk category",
                variant: "destructive"
            })
            setDeletingRiskCategoryId(null)
        }
    })

    const deleteBusinessUnitMutation = useMutation({
        mutationFn: (id: string) => businessUnitsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-units"] })
            toast({ title: "Success", description: "Business unit deleted successfully" })
            setDeletingBusinessUnitId(null)
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete business unit",
                variant: "destructive"
            })
            setDeletingBusinessUnitId(null)
        }
    })

    const deleteControlDomainMutation = useMutation({
        mutationFn: (id: string) => governanceApi.deleteDomain(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["control-domains"] })
            toast({ title: "Success", description: "Control domain deleted successfully" })
            setDeletingControlDomainId(null)
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete control domain",
                variant: "destructive"
            })
            setDeletingControlDomainId(null)
        }
    })

    const deleteStandardMutation = useMutation({
        mutationFn: (id: string) => governanceApi.deleteStandard(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["standards"] })
            toast({ title: "Success", description: "Standard deleted successfully" })
            setDeletingStandardId(null)
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete standard",
                variant: "destructive"
            })
            setDeletingStandardId(null)
        }
    })

    return (
        <div className="flex flex-col gap-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[750px] h-auto p-1 gap-1 bg-muted">
                    <TabsTrigger value="risk-categories" className="flex items-center gap-2 py-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden md:inline">Risk Categories</span>
                        <span className="md:hidden">Risk</span>
                    </TabsTrigger>
                    <TabsTrigger value="asset-types" className="flex items-center gap-2 py-2">
                        <Server className="h-4 w-4" />
                        <span className="hidden md:inline">Asset Types</span>
                        <span className="md:hidden">Asset</span>
                    </TabsTrigger>
                    <TabsTrigger value="business-units" className="flex items-center gap-2 py-2">
                        <Building2 className="h-4 w-4" />
                        <span className="hidden md:inline">Business Units</span>
                        <span className="md:hidden">BUs</span>
                    </TabsTrigger>
                    <TabsTrigger value="domains" className="flex items-center gap-2 py-2">
                        <Database className="h-4 w-4" />
                        <span className="hidden md:inline">Control Domains</span>
                        <span className="md:hidden">Domains</span>
                    </TabsTrigger>
                    <TabsTrigger value="standards" className="flex items-center gap-2 py-2">
                        <Lock className="h-4 w-4" />
                        <span className="hidden md:inline">Standards</span>
                        <span className="md:hidden">STDs</span>
                    </TabsTrigger>
                </TabsList>

                <Card className="border shadow-sm">
                    <CardHeader className="pb-3 border-b bg-muted/30">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg">
                                    {activeTab === "risk-categories" && "Risk Categories"}
                                    {activeTab === "asset-types" && "Asset Types"}
                                    {activeTab === "business-units" && "Business Units"}
                                    {activeTab === "domains" && "Control Domains"}
                                    {activeTab === "standards" && "Standards"}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {activeTab === "risk-categories" && "Define nested categories for risk classification and reporting."}
                                    {activeTab === "asset-types" && "Classification of physical, information, software and other assets."}
                                    {activeTab === "business-units" && "Your organizational structure and departments."}
                                    {activeTab === "domains" && "Logical grouping of control objectives and standards."}
                                    {activeTab === "standards" && "Requirement sets and criteria for compliance assessment."}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-8 h-9 text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                {activeTab === "asset-types" && (
                                    <Button size="sm" className="h-9" onClick={() => { setEditingAssetType(null); setIsAssetTypeFormOpen(true); }}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New
                                    </Button>
                                )}
                                {activeTab === "risk-categories" && (
                                    <Button size="sm" className="h-9" onClick={() => { setEditingRiskCategory(null); setIsRiskCategoryFormOpen(true); }}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New
                                    </Button>
                                )}
                                {activeTab === "business-units" && (
                                    <Button size="sm" className="h-9" onClick={() => { setEditingBusinessUnit(null); setIsBusinessUnitFormOpen(true); }}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New
                                    </Button>
                                )}
                                {activeTab === "domains" && (
                                    <Button size="sm" className="h-9" onClick={() => { setEditingControlDomain(null); setIsControlDomainFormOpen(true); }}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New
                                    </Button>
                                )}
                                {activeTab === "standards" && (
                                    <Button size="sm" className="h-9" onClick={() => { setEditingStandard(null); setIsStandardFormOpen(true); }}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {activeTab === "risk-categories" && (
                            <RiskCategoriesList
                                searchQuery={searchQuery}
                                onEdit={(cat) => { setEditingRiskCategory(cat); setIsRiskCategoryFormOpen(true); }}
                                onDelete={(id) => setDeletingRiskCategoryId(id)}
                            />
                        )}
                        {activeTab === "asset-types" && (
                            <AssetTypesList
                                searchQuery={searchQuery}
                                onEdit={(type) => { setEditingAssetType(type); setIsAssetTypeFormOpen(true); }}
                                onDelete={(id) => setDeletingAssetTypeId(id)}
                            />
                        )}
                        {activeTab === "business-units" && (
                            <BusinessUnitsList
                                searchQuery={searchQuery}
                                onEdit={(unit) => { setEditingBusinessUnit(unit); setIsBusinessUnitFormOpen(true); }}
                                onDelete={(id) => setDeletingBusinessUnitId(id)}
                            />
                        )}
                        {activeTab === "domains" && (
                            <ControlDomainsList
                                searchQuery={searchQuery}
                                onEdit={(domain) => { setEditingControlDomain(domain); setIsControlDomainFormOpen(true); }}
                                onDelete={(id) => setDeletingControlDomainId(id)}
                            />
                        )}
                        {activeTab === "standards" && (
                            <StandardsList
                                searchQuery={searchQuery}
                                onEdit={(std) => { setEditingStandard(std); setIsStandardFormOpen(true); }}
                                onDelete={(id) => setDeletingStandardId(id)}
                            />
                        )}
                    </CardContent>
                </Card>
            </Tabs>

            <AssetTypeForm
                open={isAssetTypeFormOpen}
                onOpenChange={setIsAssetTypeFormOpen}
                typeId={editingAssetType?.id}
                initialData={editingAssetType}
            />

            <RiskCategoryForm
                open={isRiskCategoryFormOpen}
                onOpenChange={setIsRiskCategoryFormOpen}
                categoryId={editingRiskCategory?.id}
                initialData={editingRiskCategory}
            />

            <BusinessUnitForm
                open={isBusinessUnitFormOpen}
                onOpenChange={setIsBusinessUnitFormOpen}
                unitId={editingBusinessUnit?.id}
                initialData={editingBusinessUnit}
                parentOptions={queryClient.getQueryData(["business-units"]) || []}
            />

            <ControlDomainForm
                open={isControlDomainFormOpen}
                onOpenChange={setIsControlDomainFormOpen}
                domainId={editingControlDomain?.id}
                initialData={editingControlDomain}
                parentOptions={queryClient.getQueryData(["control-domains"]) || []}
            />

            <StandardForm
                open={isStandardFormOpen}
                onOpenChange={setIsStandardFormOpen}
                standardId={editingStandard?.id}
                initialData={editingStandard}
            />

            <AlertDialog
                open={!!deletingAssetTypeId || !!deletingRiskCategoryId || !!deletingBusinessUnitId || !!deletingControlDomainId || !!deletingStandardId}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingAssetTypeId(null)
                        setDeletingRiskCategoryId(null)
                        setDeletingBusinessUnitId(null)
                        setDeletingControlDomainId(null)
                        setDeletingStandardId(null)
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this custom {
                                deletingAssetTypeId ? "asset type" :
                                    deletingRiskCategoryId ? "risk category" :
                                        deletingBusinessUnitId ? "business unit" :
                                            deletingControlDomainId ? "control domain" : "standard"
                            }. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deletingAssetTypeId) deleteAssetTypeMutation.mutate(deletingAssetTypeId)
                                if (deletingRiskCategoryId) deleteRiskCategoryMutation.mutate(deletingRiskCategoryId)
                                if (deletingBusinessUnitId) deleteBusinessUnitMutation.mutate(deletingBusinessUnitId)
                                if (deletingControlDomainId) deleteControlDomainMutation.mutate(deletingControlDomainId)
                                if (deletingStandardId) deleteStandardMutation.mutate(deletingStandardId)
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

function RiskCategoriesList({
    searchQuery,
    onEdit,
    onDelete
}: {
    searchQuery: string,
    onEdit: (category: any) => void,
    onDelete: (id: string) => void
}) {
    const { data: categories, isLoading } = useQuery({
        queryKey: ["risk-categories"],
        queryFn: () => riskCategoriesApi.getAll(true, false),
    })

    if (isLoading) return <div className="flex justify-center p-8 text-sm text-muted-foreground">Loading categories...</div>

    const filtered = categories?.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-3">
            {filtered?.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg text-sm text-muted-foreground">
                    No risk categories found.
                </div>
            ) : (
                filtered?.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{category.name}</span>
                                    <Badge variant="outline" className="font-mono text-[9px] h-4">{category.code}</Badge>
                                    {!(category as any).tenant_id ? (
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-1.5 text-[9px] h-4">
                                            <Globe className="h-2.5 w-2.5" /> Global
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 px-1.5 text-[9px] h-4">
                                            <Lock className="h-2.5 w-2.5" /> Custom
                                        </Badge>
                                    )}
                                </div>
                                {category.description && <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{category.description}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onEdit(category)}
                                disabled={!(category as any).tenant_id}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onDelete(category.id)}
                                disabled={!(category as any).tenant_id}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

function AssetTypesList({
    searchQuery,
    onEdit,
    onDelete
}: {
    searchQuery: string,
    onEdit: (type: any) => void,
    onDelete: (id: string) => void
}) {
    const { data: assetTypes, isLoading } = useQuery({
        queryKey: ["asset-types"],
        queryFn: () => assetTypesApi.getAll(),
    })

    if (isLoading) return <div className="flex justify-center p-8 text-sm text-muted-foreground">Loading types...</div>

    const filtered = assetTypes?.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="space-y-3">
            {filtered?.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg text-sm text-muted-foreground">
                    No asset types found.
                </div>
            ) : (
                filtered?.map((type) => (
                    <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{type.name}</span>
                                    <Badge variant="outline" className="capitalize text-[9px] h-4">{type.category}</Badge>
                                    {!(type as any).tenantId ? (
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-1.5 text-[9px] h-4">
                                            <Globe className="h-2.5 w-2.5" /> Global
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 px-1.5 text-[9px] h-4">
                                            <Lock className="h-2.5 w-2.5" /> Custom
                                        </Badge>
                                    )}
                                </div>
                                {type.description && <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{type.description}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onEdit(type)}
                                disabled={!(type as any).tenantId}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onDelete(type.id)}
                                disabled={!(type as any).tenantId}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

function BusinessUnitsList({
    searchQuery,
    onEdit,
    onDelete
}: {
    searchQuery: string,
    onEdit: (unit: any) => void,
    onDelete: (id: string) => void
}) {
    const { data: units, isLoading } = useQuery({
        queryKey: ["business-units"],
        queryFn: () => businessUnitsApi.getAll(),
    })

    if (isLoading) return <div className="flex justify-center p-8 text-sm text-muted-foreground">Loading units...</div>

    const filtered = units?.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="space-y-3">
            {filtered?.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg text-sm text-muted-foreground">
                    No business units found.
                </div>
            ) : (
                filtered?.map((unit) => (
                    <div key={unit.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{unit.name}</span>
                                    {unit.code && <Badge variant="outline" className="font-mono text-[9px] h-4">{unit.code}</Badge>}
                                    {!(unit as any).tenantId ? (
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-1.5 text-[9px] h-4">
                                            <Globe className="h-2.5 w-2.5" /> Global
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 px-1.5 text-[9px] h-4">
                                            <Lock className="h-2.5 w-2.5" /> Custom
                                        </Badge>
                                    )}
                                </div>
                                {unit.description && <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{unit.description}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onEdit(unit)}
                                disabled={!(unit as any).tenantId}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onDelete(unit.id)}
                                disabled={!(unit as any).tenantId}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

function ControlDomainsList({
    searchQuery,
    onEdit,
    onDelete
}: {
    searchQuery: string,
    onEdit: (domain: any) => void,
    onDelete: (id: string) => void
}) {
    const { data: domains, isLoading } = useQuery({
        queryKey: ["control-domains"],
        queryFn: () => governanceApi.getDomains(true),
    })

    if (isLoading) return <div className="flex justify-center p-8 text-sm text-muted-foreground">Loading domains...</div>

    const filtered = domains?.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.code && d.code.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="space-y-3">
            {filtered?.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg text-sm text-muted-foreground">
                    No control domains found.
                </div>
            ) : (
                filtered?.map((domain) => (
                    <div key={domain.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{domain.name}</span>
                                    {domain.code && <Badge variant="outline" className="font-mono text-[9px] h-4">{domain.code}</Badge>}
                                    {!domain.tenantId && !domain.tenant_id ? (
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-1.5 text-[9px] h-4">
                                            <Globe className="h-2.5 w-2.5" /> Global
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 px-1.5 text-[9px] h-4">
                                            <Lock className="h-2.5 w-2.5" /> Custom
                                        </Badge>
                                    )}
                                </div>
                                {domain.description && <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{domain.description}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onEdit(domain)}
                                disabled={!domain.tenantId && !domain.tenant_id}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onDelete(domain.id)}
                                disabled={!domain.tenantId && !domain.tenant_id}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

function StandardsList({
    searchQuery,
    onEdit,
    onDelete
}: {
    searchQuery: string,
    onEdit: (standard: any) => void,
    onDelete: (id: string) => void
}) {
    const { data: standards, isLoading } = useQuery({
        queryKey: ["standards"],
        queryFn: () => governanceApi.getStandards({ limit: 100 }),
    })

    if (isLoading) return <div className="flex justify-center p-8 text-sm text-muted-foreground">Loading standards...</div>

    const filtered = standards?.data.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.standard_identifier.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-3">
            {filtered?.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg text-sm text-muted-foreground">
                    No standards found.
                </div>
            ) : (
                filtered?.map((standard) => (
                    <div key={standard.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{standard.title}</span>
                                    <Badge variant="outline" className="font-mono text-[9px] h-4">{standard.standard_identifier}</Badge>
                                    {!(standard as any).tenantId && !(standard as any).tenant_id ? (
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-1.5 text-[9px] h-4">
                                            <Globe className="h-2.5 w-2.5" /> Global
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 px-1.5 text-[9px] h-4">
                                            <Lock className="h-2.5 w-2.5" /> Custom
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="capitalize text-[9px] h-4">{standard.status}</Badge>
                                </div>
                                {standard.description && <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{standard.description}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onEdit(standard)}
                                disabled={!(standard as any).tenantId && !(standard as any).tenant_id}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onDelete(standard.id)}
                                disabled={!(standard as any).tenantId && !(standard as any).tenant_id}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
