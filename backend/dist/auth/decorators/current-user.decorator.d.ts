export interface CurrentUserData {
    userId: string;
    email: string;
    role: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
