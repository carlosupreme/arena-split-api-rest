import {AuthRepository} from "../interfaces/AuthRepository";
import {Hasher} from "../interfaces/Hasher";

export class InMemoryAuthRepository implements AuthRepository {
    private readonly credentials: Map<string, string>;

    constructor(private readonly hasher: Hasher) {
        this.credentials = new Map();
    }

    async assignPassword(email: string, password: string): Promise<void> {
        const hashedPassword = await this.hasher.hash(password);
        this.credentials.set(email, hashedPassword);
    }

    async checkPassword(email: string, password: string): Promise<boolean> {
        const hashedPassword = this.credentials.get(email);

        if (!hashedPassword) {
            return false;
        }

        return await this.hasher.compare(password, hashedPassword);
    }

}