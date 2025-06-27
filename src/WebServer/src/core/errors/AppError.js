class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class NotFoundError extends AppError {}

class ValidationError extends AppError {}

class UnauthorizedError extends AppError {}

class ForbiddenError extends AppError {}

class UserAlreadyExistsError extends AppError {}

class MailValidationError extends AppError {}

export {
    AppError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    UserAlreadyExistsError,
    MailValidationError,
};