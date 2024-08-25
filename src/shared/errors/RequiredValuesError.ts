export class RequiredValuesError extends Error {
    public missingFields: string[];

    constructor(missingFields: string[]) {
        const message = `Required fields missing: ${missingFields.join(', ')}`;
        super(message);
        this.name = 'RequiredValuesError';
        this.missingFields = missingFields;

        Object.setPrototypeOf(this, RequiredValuesError.prototype);
    }
}