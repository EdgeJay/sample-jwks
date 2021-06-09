import { RequestHandler } from 'express';
import { body, header, validationResult, ValidationError, Result } from 'express-validator';

type ParamsDictionary = {
  [key: string]: string;
};

type ExtendedReqBody = {
  sub: string;
  secondsToExpiry: number;
  [key: string]: unknown;
};

export type GenerateReqBody = {
  count: number;
  usePEM?: boolean;
};

export type ExtendedRequestHandler<R = ExtendedReqBody> = RequestHandler<
  ParamsDictionary,
  unknown,
  R
>;

export const tokenParams = [
  body('sub', 'Sub field must contain email address').isEmail(),
  body('secondsToExpiry', 'secondsToExpiry field must contain integer equals or greater than 1')
    .isInt({ min: 1 })
    .toInt(),
];

export const verifyParams = [
  header('Authorization', 'Missing Authorization header')
    .isString()
    .notEmpty()
    .customSanitizer((value) => (value as string).replace('Bearer ', '')),
];

export const generateParams = [
  body('count', 'count field must contain integer equals or greater than 1')
    .optional()
    .isInt({ min: 1 })
    .toInt(),
  body('usePEM').optional().toBoolean(),
];

interface FormattedError {
  errors: {
    param: string;
    msg: string;
  }[];
}

const formatError = (err: Result<ValidationError>): FormattedError => {
  return { errors: err.array().map(({ param, msg }) => ({ param, msg })) };
};

export const validateParams: RequestHandler = (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (err) {
    res.status(400).json(formatError(err));
  }
};
