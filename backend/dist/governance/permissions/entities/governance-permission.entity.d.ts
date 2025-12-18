export declare enum GovernanceModule {
    INFLUENCERS = "influencers",
    POLICIES = "policies",
    STANDARDS = "standards",
    CONTROLS = "controls",
    ASSESSMENTS = "assessments",
    EVIDENCE = "evidence",
    FINDINGS = "findings",
    SOPS = "sops",
    REPORTING = "reporting",
    ADMIN = "admin"
}
export declare enum GovernanceAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    PUBLISH = "publish",
    APPROVE = "approve",
    ASSIGN = "assign",
    EXPORT = "export",
    CONFIGURE = "configure"
}
export declare class GovernancePermission {
    id: string;
    role: string;
    module: GovernanceModule;
    action: GovernanceAction;
    resource_type: string | null;
    conditions: Record<string, any> | null;
    created_at: Date;
    updated_at: Date;
}
