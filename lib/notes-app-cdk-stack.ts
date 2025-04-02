import * as cdk from "aws-cdk-lib";
import { RemovalPolicy } from "aws-cdk-lib";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class NotesAppCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates an S3 bucket to host the app
    const bucket = new Bucket(this, "NotesAppBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true, // Allows public access for static website
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS, // Allow public access through bucket policies
      removalPolicy: RemovalPolicy.DESTROY, // Use RemovalPolicy.RETAIN in production
      autoDeleteObjects: true, // Remove this in production
    });
    // Deploys the app to the S3 bucket
    new BucketDeployment(this, "DeployReactApp", {
      sources: [Source.asset("../notes-app/dist")],
      destinationBucket: bucket,
      retainOnDelete: false, // Ensure the files are deleted with the bucket
    });
    // Outputs the URL of the website
    new cdk.CfnOutput(this, "WebsiteURL", {
      value: bucket.bucketWebsiteUrl,
    });
  }
}
