#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SubSite } from '../genesis-cdk/src/index.js';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'teetime-sconi-io', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-2',
  },
});

new SubSite({
  scope: stack,
  domain: 'teetime',
  src: '../www/dist',
});
