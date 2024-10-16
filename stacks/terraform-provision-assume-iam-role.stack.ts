import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class TerraformProvisionAssumeIamRoleCdkStack extends cdk.Stack {
  private role: iam.Role;

  constructor(scope: Construct, id: string, userArns: string[], props?: cdk.StackProps) {
    super(scope, id, props);

    const principalArns = userArns.map((arn) => new iam.ArnPrincipal(arn));

    this.role = new iam.Role(this, 'TerraformProvisionAssumeRole', {
      roleName: 'TerraformProvisionAssumeRole',
      assumedBy: new iam.CompositePrincipal(...principalArns)
    });

    this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"));
  }
}
