import { ComplianceFramework } from '../../../common/entities/compliance-framework.entity';
import { User } from '../../../users/entities/user.entity';
export declare class FrameworkVersion {
    id: string;
    framework_id: string;
    framework: ComplianceFramework;
    version: string;
    version_notes: string;
    structure: {
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
    effective_date: Date;
    is_current: boolean;
    created_by: string;
    creator: User;
    created_at: Date;
}
