import {RequiredValuesError} from "../errors/RequiredValuesError";

export class RequiredValuesValidator {
    static validate(data: any, requiredFields: string[]): void {
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            throw new RequiredValuesError(missingFields);
        }
    }
}