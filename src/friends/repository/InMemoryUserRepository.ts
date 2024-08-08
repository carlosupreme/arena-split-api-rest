import {User, UserRepository} from "arena-split-core";

export class InMemoryUserRepository implements UserRepository {
    readonly users: User[];

    constructor() {
        this.users = [];
    }

    async add(user: User): Promise<void> {
        this.users.push(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.getEmail().value === email) || null;
    }
}