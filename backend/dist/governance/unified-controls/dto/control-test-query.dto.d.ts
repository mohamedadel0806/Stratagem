import { ControlTestType, ControlTestStatus, ControlTestResult } from '../entities/control-test.entity';
export declare class ControlTestQueryDto {
    page?: number;
    limit?: number;
    unified_control_id?: string;
    tester_id?: string;
    test_type?: ControlTestType;
    status?: ControlTestStatus;
    result?: ControlTestResult;
    search?: string;
}
