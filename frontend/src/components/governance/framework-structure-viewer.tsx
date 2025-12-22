"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

export function FrameworkStructureViewer({ structure }: FrameworkStructureViewerProps) {
  // If we have structured data, use it
  if (structure.structure?.domains) {
    return (
      <div className="space-y-4">
        {structure.structure.domains.map((domain, domainIdx) => (
          <Card key={domainIdx}>
            <CardHeader>
              <CardTitle className="text-lg">{domain.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {domain.categories && domain.categories.length > 0 ? (
                <Accordion type="multiple" className="w-full">
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
                              {category.requirements.length !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {category.requirements && category.requirements.length > 0 ? (
                          <div className="space-y-2 pl-4">
                            {category.requirements.map((req, reqIdx) => (
                              <div
                                key={reqIdx}
                                className="border-l-2 border-muted pl-4 py-2"
                              >
                                <div className="flex items-start gap-2">
                                  <Badge variant="outline" className="font-mono">
                                    {req.identifier}
                                  </Badge>
                                  <div className="flex-1">
                                    <div className="font-medium">{req.title}</div>
                                    {req.text && (
                                      <div className="text-sm text-muted-foreground mt-1">
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
                            No requirements in this category
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-sm text-muted-foreground">No categories</div>
              )}
            </CardContent>
          </Card>
        ))}
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

    return (
      <div className="space-y-4">
        {Object.values(grouped).map((group, idx) => (
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
                    className="border-l-2 border-muted pl-4 py-2"
                  >
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="font-mono">
                        {req.requirement_identifier}
                      </Badge>
                      <div className="flex-1">
                        <div className="font-medium">{req.title}</div>
                        {req.requirement_text && (
                          <div className="text-sm text-muted-foreground mt-1">
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
    );
  }

  return (
    <div className="text-center py-8 text-muted-foreground">
      No structure data available for this framework
    </div>
  );
}


