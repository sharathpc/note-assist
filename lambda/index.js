import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Initialize SNS client
const snsClient = new SNSClient({
  region: "us-east-1",
  endpoint: "https://localhost.localstack.cloud:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

/**
 * Lambda function to process S3 image upload events and send SNS notifications
 * @param {Object} event - S3 event data
 * @param {Object} context - Lambda context
 * @returns {Object} Response object
 */
export const handler = async (event, context) => {
  console.log("Received S3 event:", JSON.stringify(event, null, 2));

  // Get SNS topic ARN from environment variable
  const snsTopicArn = process.env.SNS_TOPIC_ARN;

  if (!snsTopicArn) {
    console.error("SNS_TOPIC_ARN environment variable is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SNS topic ARN not configured" }),
    };
  }

  try {
    const processedRecords = [];

    // Process each record in the event
    for (const record of event.Records) {
      // Get S3 bucket and object information
      const bucketName = record.s3.bucket.name;
      const objectKey = decodeURIComponent(
        record.s3.object.key.replace(/\+/g, " ")
      );
      const objectSize = record.s3.object.size;
      const eventName = record.eventName;
      const eventTime = record.eventTime;

      console.log(`Processing file: ${objectKey} from bucket: ${bucketName}`);

      // Check if the uploaded file is an image
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
        ".tiff",
        ".svg",
      ];
      const isImage = imageExtensions.some((ext) =>
        objectKey.toLowerCase().endsWith(ext)
      );

      if (isImage) {
        console.log(`Image detected: ${objectKey}`);

        // Prepare the notification message
        const message = {
          event: "Image Upload",
          bucket: bucketName,
          object_key: objectKey,
          object_size: objectSize,
          event_name: eventName,
          event_time: eventTime,
          timestamp: new Date().toISOString(),
          message: `New image '${objectKey}' uploaded to bucket '${bucketName}'`,
        };

        // Create a human-readable subject
        const subject = `Note Assist: Image Upload Notification - ${objectKey}`;

        // Create and send the publish command
        const response = await snsClient.send(
          new PublishCommand({
            TopicArn: snsTopicArn,
            Subject: subject,
            Message: JSON.stringify(message, null, 2),
            MessageAttributes: {
              bucket: {
                DataType: "String",
                StringValue: bucketName,
              },
              object_key: {
                DataType: "String",
                StringValue: objectKey,
              },
              event_type: {
                DataType: "String",
                StringValue: "image_upload",
              },
              file_size: {
                DataType: "Number",
                StringValue: objectSize.toString(),
              },
            },
          })
        );

        console.log(`SNS notification sent for image upload: ${objectKey}`);
        console.log(`Message ID: ${response.MessageId}`);

        processedRecords.push({
          objectKey,
          messageId: response.MessageId,
          status: "success",
        });
      } else {
        console.log(
          `File ${objectKey} is not an image, skipping SNS notification`
        );
        processedRecords.push({
          objectKey,
          status: "skipped",
          reason: "not_an_image",
        });
      }
    }

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Successfully processed S3 events",
          processed_records: processedRecords.length,
          records: processedRecords,
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.error("Error processing S3 event:", error);

    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Error processing S3 events",
          error: error.message,
          stack: error.stack,
        },
        null,
        2
      ),
    };
  }
};
