import { INestApplication } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

export interface INestTestApp {
  app: INestApplication;
  server: AbstractHttpAdapter;
};