
import { Request, Response, NextFunction } from 'express';
import { handleErrorResponse } from "../helpers/errorHandler";
import { HttpStatusCode } from "../types/error";
import { UserService } from '../services/users'

/**
 * Retrieves and verifies the token from the request headers.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<void>} - Promise that resolves to void.
 */
export const getAndVerifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.headers.authorization)   {
            const hasAccess = await UserService.verifyToken(req.headers.authorization.replace('Bearer ', ''));
            if(hasAccess){
                req.params.UserId = hasAccess.id.toString();
                next();
            } 
            else handleErrorResponse(res, HttpStatusCode.FORBIDDEN);
        }else handleErrorResponse(res, HttpStatusCode.BAD_REQUEST);
    } catch (error) {
        handleErrorResponse(res, HttpStatusCode.FORBIDDEN);
    }
};