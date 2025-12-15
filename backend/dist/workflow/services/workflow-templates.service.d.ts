import { CreateWorkflowDto } from '../dto/create-workflow.dto';
export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    workflow: Omit<CreateWorkflowDto, 'name' | 'description'>;
}
export declare class WorkflowTemplatesService {
    getTemplates(): WorkflowTemplate[];
    getTemplateById(id: string): WorkflowTemplate | undefined;
    getTemplatesByCategory(category: string): WorkflowTemplate[];
}
