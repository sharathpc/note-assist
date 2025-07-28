import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const AWS_CONNECTION_DETAILS = {
  region: "us-east-1",
  endpoint: `http://${process.env.AWS_HOST}`,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
};

const globalForAws = global as unknown as {
  dynamodb: DynamoDBDocumentClient;
  s3Client: S3Client;
};

const dynamodb =
  globalForAws.dynamodb ||
  DynamoDBDocumentClient.from(
    new DynamoDBClient({ ...AWS_CONNECTION_DETAILS })
  );

const s3Client =
  globalForAws.s3Client ||
  new S3Client({ ...AWS_CONNECTION_DETAILS, forcePathStyle: true });

if (process.env.NODE_ENV !== "production") {
  globalForAws.dynamodb = dynamodb;
  globalForAws.s3Client = s3Client;
}

export { dynamodb, s3Client };
