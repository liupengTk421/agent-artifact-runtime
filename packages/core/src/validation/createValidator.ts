import Ajv, { type ErrorObject } from "ajv";

export type ValidationResult = {
  valid: boolean;
  errors?: ErrorObject[] | null;
};

export function createValidator(schema: object) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  return (value: unknown): ValidationResult => {
    const valid = validate(value);
    return { valid, errors: validate.errors };
  };
}
