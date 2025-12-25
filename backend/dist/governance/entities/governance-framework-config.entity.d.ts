import { User } from '../../users/entities/user.entity';
import { ComplianceFramework } from '../../common/entities/compliance-framework.entity';
export declare enum FrameworkType {
    ISO27001 = "iso27001",
    NIST_CYBERSECURITY = "nist_cybersecurity",
    NIST_PRIVACY = "nist_privacy",
    PCI_DSS = "pci_dss",
    GDPR = "gdpr",
    NCA_ECC = "nca_ecc",
    SOC2 = "soc2",
    HIPAA = "hipaa",
    CUSTOM = "custom"
}
export declare class GovernanceFrameworkConfig {
    id: string;
    name: string;
    description: string;
    framework_type: FrameworkType;
    scope: string;
    is_active: boolean;
    linked_framework_id: string;
    linked_framework: ComplianceFramework;
    metadata: {
        require_policy_approval?: boolean;
        require_control_testing?: boolean;
        policy_review_frequency?: string;
        control_review_frequency?: string;
        risk_assessment_required?: boolean;
        audit_required?: boolean;
        integration_points?: string[];
    };
    created_by: string;
    creator: User;
    created_at: Date;
    updated_by: string;
    updater: User;
    updated_at: Date;
    deleted_at: Date;
}
