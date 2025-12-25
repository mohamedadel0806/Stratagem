"use client";

import React, { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";

interface FrameworkStructureViewerProps {
  structure: {
    structure?: {
      domains?: Array<{
        name: string;
        categories?: Array<{
          name: string;
          requirements?: Array<{
            identifier: string;
            title: string;
            text: string;
          }>;
        }>;
      }>;
    };
    requirements?: Array<{
      id: string;
      requirement_identifier: string;
      title: string;
      requirement_text: string;
      domain?: string;
      category?: string;
      subcategory?: string;
    }>;
  };
  frameworkName?: string;
}

export function FrameworkStructureViewer({
  structure,
  frameworkName = "Framework",
}: FrameworkStructureViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandAll, setExpandAll] = useState(false);

  // Filter requirements based on search query
  const filterRequirements = (items: any[]) => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const identifier = (
        item.identifier ||
        item.requirement_identifier ||
        ""
      ).toLowerCase();
      const title = (item.title || "").toLowerCase();
      const text = (item.text || item.requirement_text || "").toLowerCase();
      
      return (
        identifier.includes(query) ||
        title.includes(query) ||
        text.includes(query)
      );
    });
  };

  const clearSearch = () => setSearchQuery("");

  // If we have structured data, use it
  if (structure.structure?.domains) {
    const filteredDomains = structure.structure.domains
      .map((domain) => ({
        ...domain,
        categories: domain.categories?.map((category) => ({
          ...category,
          requirements: filterRequirements(category.requirements || []),
        })).filter((cat) => (cat.requirements?.length || 0) > 0),
      }))
      .filter((domain) => (domain.categories?.length || 0) > 0);

    const totalRequirements = structure.structure.domains.reduce(
      (sum, domain) =>
        sum +
        (domain.categories?.reduce(
          (catSum, cat) => catSum + (cat.requirements?.length || 0),
          0
        ) || 0),
      0
    );

    const filteredCount = filteredDomains.reduce(
      (sum, domain) =>
        sum +
        (domain.categories?.reduce(
          (catSum, cat) => catSum + (cat.requirements?.length || 0),
          0
        ) || 0),
      0
    );

    return (
      <div className="space-y-4">
        {/* Search and Summary Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{frameworkName} Structure</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {structure.structure.domains.length} domain
                    {structure.structure.domains.length !== 1 ? "s" : ""} •{" "}
                    {totalRequirements} requirement
                    {totalRequirements !== 1 ? "s" : ""}
                    {searchQuery && ` • ${filteredCount} matching`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandAll(!expandAll)}
                  className="gap-2"
                >
                  {expandAll ? (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Collapse All
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-4 w-4" />
                      Expand All
                    </>
                  )}
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requirements by ID, title, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Domains and Requirements */}
        {filteredDomains.length > 0 ? (
          <div className="space-y-4">
            {filteredDomains.map((domain, domainIdx) => (
              <Card key={domainIdx}>
                <CardHeader>
                  <CardTitle className="text-lg">{domain.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {domain.categories && domain.categories.length > 0 ? (
                    <Accordion
                      type="multiple"
                      defaultValue={
                        expandAll
                          ? domain.categories.map(
                              (_, categoryIdx) =>
                                `domain-${domainIdx}-category-${categoryIdx}`
                            )
                          : []
                      }
                      className="w-full"
                    >
                      {domain.categories.map((category, categoryIdx) => (
                        <AccordionItem
                          key={categoryIdx}
                          value={`domain-${domainIdx}-category-${categoryIdx}`}
                        >
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <span>{category.name}</span>
                              {category.requirements && (
                                <Badge variant="secondary">
                                  {category.requirements.length} requirement
                                  {category.requirements.length !== 1
                                    ? "s"
                                    : ""}
                                </Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {category.requirements &&
                            category.requirements.length > 0 ? (
                              <div className="space-y-2 pl-4">
                                {category.requirements.map((req, reqIdx) => (
                                  <div
                                    key={reqIdx}
                                    className="border-l-2 border-blue-200 bg-blue-50 pl-4 py-3 rounded"
                                  >
                                    <div className="flex items-start gap-2">
                                      <Badge
                                        variant="outline"
                                        className="font-mono text-xs flex-shrink-0"
                                      >
                                        {req.identifier}
                                      </Badge>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900">
                                          {req.title}
                                        </div>
                                        {req.text && (
                                          <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words">
                                            {req.text}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground pl-4">
                                No matching requirements in this category
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No matching categories
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No requirements match your search. Try a different query."
                  : "No structure data available for this framework"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Otherwise, use requirements list grouped by domain/category
  if (structure.requirements && structure.requirements.length > 0) {
    const grouped = structure.requirements.reduce((acc, req) => {
      const domain = req.domain || "Uncategorized";
      const category = req.category || "Uncategorized";
      const key = `${domain}::${category}`;

      if (!acc[key]) {
        acc[key] = {
          domain,
          category,
          requirements: [],
        };
      }

      acc[key].requirements.push(req);
      return acc;
    }, {} as Record<string, { domain: string; category: string; requirements: typeof structure.requirements }>);

    const filteredGroups = Object.values(grouped)
      .map((group) => ({
        ...group,
        requirements: filterRequirements(group.requirements),
      }))
      .filter((group) => group.requirements.length > 0);

    const totalRequirements = structure.requirements.length;
    const filteredCount = filteredGroups.reduce(
      (sum, group) => sum + group.requirements.length,
      0
    );

    return (
      <div className="space-y-4">
        {/* Search Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{frameworkName} Requirements</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {totalRequirements} requirement
                    {totalRequirements !== 1 ? "s" : ""}
                    {searchQuery && ` • ${filteredCount} matching`}
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requirements by ID, title, or text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Requirements List */}
        {filteredGroups.length > 0 ? (
          <div className="space-y-4">
            {filteredGroups.map((group, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {group.domain} / {group.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {group.requirements.map((req) => (
                      <div
                        key={req.id}
                        className="border-l-2 border-blue-200 bg-blue-50 pl-4 py-3 rounded"
                      >
                        <div className="flex items-start gap-2">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs flex-shrink-0"
                          >
                            {req.requirement_identifier}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">
                              {req.title}
                            </div>
                            {req.requirement_text && (
                              <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words">
                                {req.requirement_text}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No requirements match your search. Try a different query."
                  : "No requirements available"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="py-8 text-center">
        <p className="text-muted-foreground">
          No structure data available for this framework
        </p>
      </CardContent>
    </Card>
  );
}



