export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    COMPLIANCE_OFFICER = "compliance_officer",
    RISK_MANAGER = "risk_manager",
    AUDITOR = "auditor",
    USER = "user"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending"
}
export declare class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatarUrl: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    emailVerified: boolean;
    phoneVerified: boolean;
    lastLoginAt: Date;
    passwordChangedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
