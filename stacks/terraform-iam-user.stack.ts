import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export interface TerraformIamUserCdkStackBuilder {
  setUserPassword(password: string): TerraformIamUserCdkStackBuilder;
  build(): void;
}

export type TerraformIamUserCdkStackProps = Pick<iam.UserProps, 'password'>;

export class TerraformIamUserCdkStack extends cdk.Stack implements TerraformIamUserCdkStackBuilder {
  public readonly userArnCfnOutputExportName = 'TerraformUserArn';
  private _user: iam.User;
  private _password: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }

  get userArn(): string {
    return this._user.userArn;
  }

  setUserPassword(password: string): TerraformIamUserCdkStackBuilder {
    this._password = password;
    return this;
  }

  build(): void {
    if (!this._password) {
      throw new Error('Password is required');
    }

    this._user = new iam.User(this, 'TerraformUser', {
      userName: 'TerraformUser',
      password: cdk.SecretValue.isSecretValue(this._password) ? this._password : cdk.SecretValue.unsafePlainText(this._password)
    });

    new ssm.StringParameter(this, 'TerraformUserPassword', {
      parameterName: '/terraform/user/password',
      stringValue: this._password
    });
  }
}
