import {UserId} from "arena-split-core";

export class UserMother {
    private static id = UserId.create().value;
    private static fullName = "John Doe";
    private static email = "john@doe.com";
    private static username = "john_doe";

    static normal() {
        return {
            fullName: UserMother.fullName,
            email: UserMother.email,
            username: UserMother.username,
            id: UserMother.id
        }
    }

    static withInvalidId() {
        return {
            fullName: UserMother.fullName,
            email: UserMother.email,
            username: UserMother.username,
            id: "invalid-id"
        }
    }

    static withInvalidFullName() {
        return {
            fullName: "a",
            email: UserMother.email,
            username: UserMother.username,
            id: UserMother.id
        }
    }

    static withInvalidEmail() {
        return {
            fullName: UserMother.fullName,
            email: "invalid-email",
            username: UserMother.username,
            id: UserMother.id
        }
    }

    static withInvalidUsername() {
        return {
            fullName: UserMother.fullName,
            email: UserMother.email,
            username: "invalid-username",
            id: UserMother.id
        }
    }
}