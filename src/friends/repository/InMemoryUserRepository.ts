import {User, UserRepository} from "arena-split-core";

export class InMemoryUserRepository implements UserRepository {
    readonly users: User[];

    constructor() {
        this.users = [];
    }

    async updateFromId(user: User): Promise<void> {
        const index = this.users.findIndex(storedUser => storedUser.id.equals(user.id));

        if (index !== -1) {
            this.users[index] = user;
        }
    }

    async add(user: User): Promise<void> {
        this.users.push(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.getEmail().value === email) || null;
    }
}