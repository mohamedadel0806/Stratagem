export declare class CreateFrameworkVersionDto {
    version: string;
    version_notes?: string;
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
    effective_date?: string;
    is_current?: boolean;
}
