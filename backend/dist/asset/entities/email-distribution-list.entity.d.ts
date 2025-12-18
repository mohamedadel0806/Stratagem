import { User } from '../../users/entities/user.entity';
export declare class EmailDistributionList {
    id: string;
    name: string;
    description: string;
    emailAddresses: string[];
    users: User[];
    isActive: boolean;
    createdById: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
