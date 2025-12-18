import { UnifiedControl } from './unified-control.entity';
import { FrameworkRequirement } from './framework-requirement.entity';
import { User } from '../../../users/entities/user.entity';
export declare enum MappingCoverage {
    FULL = "full",
    PARTIAL = "partial",
    NOT_APPLICABLE = "not_applicable"
}
export declare class FrameworkControlMapping {
    id: string;
    framework_requirement_id: string;
    framework_requirement: FrameworkRequirement;
    unified_control_id: string;
    unified_control: UnifiedControl;
    coverage_level: MappingCoverage;
    mapping_notes: string;
    mapped_by: string;
    mapper: User;
    mapped_at: Date;
    created_at: Date;
}
