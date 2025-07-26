import express, { Application, Request, Response, NextFunction } from 'express';
import { IUser } from '../models/userModel';

export interface CustomReq extends Request {
  requestTime?: string;
}

export interface CustomUserReq extends Request {
  user?: IUser;
}
