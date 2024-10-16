#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TerraformIamUserCdkStack } from '@/stacks/terraform-iam-user.stack';
import { TerraformProvisionAssumeIamRoleCdkStack } from '@/stacks/terraform-provision-assume-iam-role.stack';
import { generate } from "generate-password";

const app = new cdk.App();

const terraformUserPassword = generate({ length: 12, numbers: true, symbols: true, lowercase: true, uppercase: true });

const terraformUserStack = new TerraformIamUserCdkStack(app, 'TerraformIamUserCdkStack');
terraformUserStack.setUserPassword(terraformUserPassword);
terraformUserStack.build();

const terraformProvisionAssumeIamRoleStack = new TerraformProvisionAssumeIamRoleCdkStack(app, 'TerraformProvisionAssumeIamRoleCdkStack', [terraformUserStack.userArn]);
terraformProvisionAssumeIamRoleStack.addDependency(terraformUserStack);