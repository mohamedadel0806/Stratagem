export declare class ImportFrameworkStructureDto {
    framework_id: string;
    version?: string;
    structure?: {
        domains?: Array<{
            name: string;
            categories?: Array<{
                name: string;
                requirements?: Array<{
                    identifier: string;
                    title: string;
                    text: string;
                    description?: string;
                    domain?: string;
                    category?: string;
                    subcategory?: string;
                    display_order?: number;
                }>;
            }>;
        }>;
    };
    create_version?: boolean;
    replace_existing?: boolean;
}
