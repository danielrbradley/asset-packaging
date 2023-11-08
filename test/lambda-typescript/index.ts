import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const pkg = new pulumi.Stack("package", {
  source: "../../lambda-typescript",
  inputs: {
    dir: "lambda",
  },
});

const assumeRole = aws.iam.getPolicyDocument({
  statements: [
    {
      effect: "Allow",
      principals: [
        {
          type: "Service",
          identifiers: ["lambda.amazonaws.com"],
        },
      ],
      actions: ["sts:AssumeRole"],
    },
  ],
});
const iamForLambda = new aws.iam.Role("iamForLambda", {
  assumeRolePolicy: assumeRole.then((assumeRole) => assumeRole.json),
});

// Create an AWS resource (S3 Bucket)
const lambda = new aws.lambda.Function("lambda", {
  runtime: "nodejs18.x",
  role: iamForLambda.arn,
  code: pkg.outputs.archive,
  handler: "index.handler",
});

// Export the name of the bucket
export const lambdaInvokeArn = lambda.invokeArn;
