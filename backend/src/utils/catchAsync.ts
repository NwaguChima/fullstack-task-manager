import express, { Request, Response, NextFunction } from 'express';
import { PathParams } from 'express-serve-static-core';

const catchAsync = (
  fn: (
    arg0: express.Request<PathParams, any, any, any, Record<string, any>>,
    arg1: express.Response<any, Record<string, any>>,
    arg2: express.NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
