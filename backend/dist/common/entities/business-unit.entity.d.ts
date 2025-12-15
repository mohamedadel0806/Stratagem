import { User } from '../../users/entities/user.entity';
export declare class BusinessUnit {
    id: string;
    name: string;
    code: string;
    parentId: string;
    parent: BusinessUnit;
    children: BusinessUnit[];
    description: string;
    managerId: string;
    manager: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
