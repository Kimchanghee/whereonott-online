#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { BaseStaticSiteStack } from '../../../shared/infrastructure/BaseStack';

const app = new App();

new BaseStaticSiteStack(app, 'WhereOnOttStack', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION || 'us-east-1',
  },
  domain: 'whereonott.com',
  buildOutputDir: '../.next/standalone',
  languages: ['ko', 'en', 'ja'],
  description: 'WhereOnOTT — Movie & TV streaming availability finder',
});

app.synth();
