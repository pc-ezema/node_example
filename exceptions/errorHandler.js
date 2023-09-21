const { BadRequestError, UnauthorizedError, ValidationError, ForbiddenError, NotFoundError, MethodNotAllowedError, ConflictError, InternalServerError, } = require('./customErrors');

function handleCustomError(err, res) {
    if (err instanceof BadRequestError) {
        return res.json({ 
            success: false, 
            message: err.message
        });
    } else if (err instanceof UnauthorizedError) {
        return res.json({ 
            success: false, 
            message: err.message
        });
    } else if (err instanceof ValidationError) {
        return res.json({ 
            success: false, 
            message: err.message
        });
    } else if (err instanceof ForbiddenError) {
        return res.json({ 
            success: false, 
            message: err.message
        });
    } else if (err instanceof NotFoundError) {
        return res.json({ 
            success: false, 
            message: err.message
        });
    } else if (err instanceof MethodNotAllowedError) {
        return res.json({ 
            success: false, 
            message: err.message
        });
    } else if (err instanceof ConflictError) {
        return res.json({ 
            success: false, 
            message: err.message
        });
    } else if (err instanceof InternalServerError) {
        return res.json({ 
            success: false, 
            message: err.message
        });
    } else {
        return res.json({ 
            success: false, 
            message: "Not found."
        });
    }
}

module.exports = handleCustomError;