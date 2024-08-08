export interface AuthRepository {
    assignPassword(email: string, password: string): Promise<void>;
    checkPassword(email: string, password: string): Promise<boolean>;
}