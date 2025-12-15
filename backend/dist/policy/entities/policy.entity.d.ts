export declare enum PolicyStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    UNDER_REVIEW = "under_review",
    ARCHIVED = "archived"
}
export declare enum PolicyType {
    SECURITY = "security",
    COMPLIANCE = "compliance",
    OPERATIONAL = "operational",
    IT = "it",
    HR = "hr",
    FINANCE = "finance"
}
export declare class Policy {
    id: string;
    title: string;
    description: string;
    policyType: PolicyType;
    status: PolicyStatus;
    version: string;
    organizationId: string;
    ownerId: string;
    effectiveDate: Date;
    reviewDate: Date;
    documentUrl: string;
    documentName: string;
    documentMimeType: string;
    createdAt: Date;
    updatedAt: Date;
}
