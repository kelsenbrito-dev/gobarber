import { ValidationError } from 'yup';

interface IErrors {
    [key: string]: string;
};

export default function getvalidationErrors(err: ValidationError): IErrors {
    const validationErrors: IErrors = {};
    err.inner.forEach(error => {
        validationErrors[error.path!] = error.message;
    });
    return validationErrors;
};