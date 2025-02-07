import { NextFunction, Request, Response } from 'express';
import { HttpError } from '~/utils/http-error';
import { ErrorReporting } from '@google-cloud/error-reporting';
import { ReportMode } from '@google-cloud/error-reporting/build/src/configuration';

const errors = new ErrorReporting({
  reportMode: process.env.REPORT_MODE as ReportMode
});

export const errorHandler = (error: Error | HttpError, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  errors.report(error);
  if (error instanceof HttpError) {
    res.status(error.errorCode).json({ message: error.message, error });
  } else {
    res.status(500).json({ message: error.message, error });
  }
};
