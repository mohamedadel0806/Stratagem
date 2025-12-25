import { FrameworkType } from '../../entities/governance-framework-config.entity';
export declare class CreateGovernanceFrameworkConfigDto {
    name: string;
    description?: string;
    framework_type: FrameworkType;
    scope?: string;
    is_active?: boolean;
    linked_framework_id?: string;
    metadata?: {
        require_policy_approval?: boolean;
        require_control_testing?: boolean;
        policy_review_frequency?: string;
        control_review_frequency?: string;
        risk_assessment_required?: boolean;
        audit_required?: boolean;
        integration_points?: string[];
    };
}
