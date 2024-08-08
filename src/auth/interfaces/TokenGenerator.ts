export interface TokenGenerator {
    generate(payload: object): Promise<string>;
    validate(token: string): Promise<object>;
}