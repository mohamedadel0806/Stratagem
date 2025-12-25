import { Response } from 'express';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyQueryDto } from './dto/policy-query.dto';
export declare class PoliciesController {
    private readonly policiesService;
    constructor(policiesService: PoliciesService);
    create(createPolicyDto: CreatePolicyDto, req: any): Promise<import("./entities/policy.entity").Policy>;
    findAll(queryDto: PolicyQueryDto): Promise<{
        data: import("./entities/policy.entity").Policy[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPublicationStatistics(): Promise<{
        totalPublished: number;
        publishedThisMonth: number;
        publishedThisYear: number;
        assignmentsCount: number;
        acknowledgedCount: number;
        acknowledgmentRate: number;
    }>;
    getPoliciesDueForReview(days?: number): Promise<{
        data: import("./entities/policy.entity").Policy[];
    }>;
    getReviewStatistics(): Promise<{
        data: {
            pending: number;
            overdue: number;
            dueIn30Days: number;
            dueIn60Days: number;
            dueIn90Days: number;
        };
    }>;
    getPendingReviews(daysAhead?: number): Promise<{
        data: import("./entities/policy.entity").Policy[];
    }>;
    getMyAssignedPolicies(req: any): Promise<{
        data: import("./entities/policy.entity").Policy[];
    }>;
    findOne(id: string): Promise<import("./entities/policy.entity").Policy>;
    update(id: string, updatePolicyDto: UpdatePolicyDto, req: any): Promise<import("./entities/policy.entity").Policy>;
    remove(id: string): Promise<void>;
    uploadAttachment(id: string, file: Express.Multer.File, req: any): Promise<{
        message: string;
        attachment: {
            filename: string;
            path: string;
            upload_date: string;
            uploaded_by: any;
        };
    }>;
    downloadAttachment(filename: string, res: Response): Promise<void>;
    getWorkflowExecutions(id: string): Promise<{
        data: {
            id: string;
            workflowId: string;
            workflowName: string;
            workflowType: import("../../workflow/entities/workflow.entity").WorkflowType;
            status: import("../../workflow/entities/workflow-execution.entity").WorkflowExecutionStatus;
            inputData: Record<string, any>;
            outputData: Record<string, any>;
            errorMessage: string;
            assignedTo: {
                id: string;
                name: string;
            };
            startedAt: string;
            completedAt: string;
            createdAt: string;
            approvals: any[];
        }[];
    }>;
    getPendingApprovals(id: string, req: any): Promise<{
        data: any[];
    }>;
    publish(id: string, body: {
        assign_to_user_ids?: string[];
        assign_to_role_ids?: string[];
        assign_to_business_unit_ids?: string[];
        notification_message?: string;
    }, req: any): Promise<{
        data: import("./entities/policy.entity").Policy;
    }>;
    initiateReview(id: string, body: {
        review_date: string;
    }, req: any): Promise<{
        data: import("./entities/policy-review.entity").PolicyReview;
    }>;
    getReviewHistory(id: string): Promise<{
        data: import("./entities/policy-review.entity").PolicyReview[];
    }>;
    getActiveReview(id: string): Promise<{
        data: import("./entities/policy-review.entity").PolicyReview;
    }>;
    completeReview(reviewId: string, body: {
        outcome: string;
        notes?: string;
        review_summary?: string;
        recommended_changes?: string;
        next_review_date?: string;
    }, req: any): Promise<{
        data: import("./entities/policy-review.entity").PolicyReview;
    }>;
    getAllHierarchies(includeArchived?: string): Promise<{
        data: any[];
    }>;
    getRootPolicies(includeArchived?: string): Promise<{
        data: import("./entities/policy.entity").Policy[];
    }>;
    getCompleteHierarchy(id: string): Promise<{
        data: any;
    }>;
    getHierarchyTree(id: string, includeArchived?: string): Promise<{
        data: any;
    }>;
    getParent(id: string): Promise<{
        data: import("./entities/policy.entity").Policy;
    }>;
    getChildren(id: string, includeArchived?: string): Promise<{
        data: import("./entities/policy.entity").Policy[];
    }>;
    getAncestors(id: string): Promise<{
        data: import("./entities/policy.entity").Policy[];
    }>;
    getDescendants(id: string): Promise<{
        data: import("./entities/policy.entity").Policy[];
    }>;
    getHierarchyLevel(id: string): Promise<{
        data: {
            level: number;
        };
    }>;
    getRoot(id: string): Promise<{
        data: import("./entities/policy.entity").Policy;
    }>;
    setParentPolicy(id: string, body: {
        parent_policy_id?: string | null;
        reason?: string;
    }, req: any): Promise<{
        data: import("./entities/policy.entity").Policy;
    }>;
    getVersionsList(id: string): Promise<{
        data: import("./entities/policy-version.entity").PolicyVersion[];
    }>;
    getLatestVersion(id: string): Promise<{
        data: import("./entities/policy-version.entity").PolicyVersion;
    }>;
    createVersion(id: string, body: {
        content: string;
        change_summary?: string;
    }, req: any): Promise<{
        data: import("./entities/policy-version.entity").PolicyVersion;
    }>;
    compareVersions(id: string, body: {
        version1_id: string;
        version2_id: string;
    }): Promise<{
        data: {
            version1: import("./entities/policy-version.entity").PolicyVersion;
            version2: import("./entities/policy-version.entity").PolicyVersion;
            differences: string[];
        };
    }>;
    getPolicyApprovals(id: string): Promise<{
        data: import("./entities/policy-approval.entity").PolicyApproval[];
    }>;
    getApprovalProgress(id: string): Promise<{
        data: {
            total: number;
            approved: number;
            rejected: number;
            pending: number;
        };
    }>;
    requestApprovals(id: string, body: {
        approver_ids: string[];
    }): Promise<{
        data: import("./entities/policy-approval.entity").PolicyApproval[];
    }>;
    approvePolicy(approvalId: string, body: {
        comments?: string;
    }): Promise<{
        data: import("./entities/policy-approval.entity").PolicyApproval;
    }>;
    rejectPolicy(approvalId: string, body: {
        comments?: string;
    }): Promise<{
        data: import("./entities/policy-approval.entity").PolicyApproval;
    }>;
    getPendingApprovalsForSystem(): Promise<{
        data: import("./entities/policy-approval.entity").PolicyApproval[];
    }>;
}
