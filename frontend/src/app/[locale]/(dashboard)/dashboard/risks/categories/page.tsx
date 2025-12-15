"use client"

import { useState } from "react"
import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { riskCategoriesApi, RiskCategoryData } from "@/lib/api/risks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  AlertTriangle,
} from "lucide-react"
import { RiskCategoryForm } from "@/components/forms/risk-category-form"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CategoryTreeNode extends RiskCategoryData {
  level: number
  children: CategoryTreeNode[]
}

export default function RiskCategoriesPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<RiskCategoryData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  const { data: categories, isLoading } = useQuery({
    queryKey: ["risk-categories", showInactive],
    queryFn: () => riskCategoriesApi.getAll(showInactive, true), // hierarchical = true
  })

  // Build tree structure from hierarchical data
  const categoryTree = React.useMemo(() => {
    if (!categories) return []

    const buildTree = (
      items: RiskCategoryData[],
      parentId: string | null = null,
      level = 0
    ): CategoryTreeNode[] => {
      return items
        .filter((item) => (parentId ? item.parent_category_id === parentId : !item.parent_category_id))
        .sort((a, b) => a.display_order - b.display_order)
        .map((item) => ({
          ...item,
          level,
          children: buildTree(items, item.id, level + 1),
        }))
    }

    return buildTree(categories)
  }, [categories])

  // Filter categories based on search query
  const filterTree = (tree: CategoryTreeNode[]): CategoryTreeNode[] => {
    if (!searchQuery) return tree

    const query = searchQuery.toLowerCase()
    return tree
      .map((node) => {
        const matchesSearch =
          node.name.toLowerCase().includes(query) ||
          node.code.toLowerCase().includes(query) ||
          node.description?.toLowerCase().includes(query)

        const filteredChildren = filterTree(node.children)

        if (matchesSearch || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren,
          }
        }
        return null
      })
      .filter((node): node is CategoryTreeNode => node !== null)
  }

  const filteredTree = filterTree(categoryTree)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => riskCategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-categories"] })
      toast({
        title: "Success",
        description: "Risk category deleted successfully",
      })
      setDeletingCategoryId(null)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete risk category",
        variant: "destructive",
      })
      setDeletingCategoryId(null)
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      riskCategoriesApi.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-categories"] })
      toast({
        title: "Success",
        description: "Category status updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update category status",
        variant: "destructive",
      })
    },
  })

  const handleEdit = (category: RiskCategoryData) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setIsFormOpen(true)
  }

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getRiskToleranceColor = (tolerance: string) => {
    switch (tolerance) {
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
    }
  }

  // Flatten all categories for parent selection (excluding the category being edited)
  const allCategoriesForParent = React.useMemo(() => {
    const flatten = (nodes: CategoryTreeNode[]): RiskCategoryData[] => {
      return nodes.flatMap((node) => [node, ...flatten(node.children)])
    }
    return flatten(categoryTree)
  }, [categoryTree])

  const renderCategoryNode = (node: CategoryTreeNode) => {
    const hasChildren = node.children.length > 0
    const isExpanded = expandedCategories.has(node.id)
    const indent = node.level * 24

    return (
      <div key={node.id} className="space-y-1">
        <div
          className={`flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
            !node.is_active ? "opacity-60" : ""
          }`}
          style={{ marginLeft: `${indent}px` }}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleExpand(node.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}

          <div className="flex-1 flex items-center gap-3">
            {node.color && (
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: node.color }}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{node.name}</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {node.code}
                </Badge>
                {!node.is_active && (
                  <Badge variant="secondary" className="text-xs">
                    Inactive
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={`text-xs ${getRiskToleranceColor(node.risk_tolerance)}`}
                >
                  {node.risk_tolerance}
                </Badge>
              </div>
              {node.description && (
                <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                toggleActiveMutation.mutate({
                  id: node.id,
                  isActive: !node.is_active,
                })
              }
              title={node.is_active ? "Deactivate" : "Activate"}
            >
              {node.is_active ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(node)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeletingCategoryId(node.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>{node.children.map((child) => renderCategoryNode(child))}</div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Risk Categories</h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage risk categories with hierarchical structure
          </p>
        </div>
        <Button onClick={handleCreate} data-testid="risk-categories-new-button">
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories by name, code, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="risk-categories-search-input"
              />
            </div>
            <Button
              variant={showInactive ? "default" : "outline"}
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
              {showInactive ? "Hide Inactive" : "Show Inactive"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Tree */}
      {filteredTree.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No categories match your search criteria"
                : showInactive
                  ? "No categories found (including inactive)"
                  : "No categories found. Create your first category to get started."}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreate} data-testid="risk-categories-create-first-button">
                <Plus className="mr-2 h-4 w-4" />
                Create First Category
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Category Hierarchy</CardTitle>
            <CardDescription>
              {categories?.length || 0} total categories
              {searchQuery && ` (${filteredTree.length} match search)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTree.map((node) => renderCategoryNode(node))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Form Dialog */}
      <RiskCategoryForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) {
            setEditingCategory(null)
          }
        }}
        categoryId={editingCategory?.id}
        initialData={editingCategory || undefined}
        parentOptions={allCategoriesForParent.filter((cat) => cat.id !== editingCategory?.id)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["risk-categories"] })
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCategoryId}
        onOpenChange={(open) => !open && setDeletingCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Risk Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
              {categories?.find((c) => c.parent_category_id === deletingCategoryId) && (
                <span className="block mt-2 text-destructive font-medium">
                  Warning: This category has sub-categories. They will become orphaned.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCategoryId && deleteMutation.mutate(deletingCategoryId)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
