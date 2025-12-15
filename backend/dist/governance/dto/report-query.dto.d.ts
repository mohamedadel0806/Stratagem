export declare enum ReportType {
    POLICY_COMPLIANCE = "policy_compliance",
    INFLUENCER = "influencer",
    CONTROL_IMPLEMENTATION = "control_implementation",
    ASSESSMENT = "assessment",
    FINDINGS = "findings",
    CONTROL_STATUS = "control_status"
}
export declare enum ExportFormat {
    CSV = "csv",
    EXCEL = "xlsx",
    PDF = "pdf"
}
export declare class ReportQueryDto {
    type: ReportType;
    format?: ExportFormat;
    startDate?: string;
    endDate?: string;
    status?: string;
    filters?: string;
}
