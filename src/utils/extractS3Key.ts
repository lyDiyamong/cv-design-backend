export function extractS3Key(s3Url: string, bucketName: string): string {
  try {
    const url = new URL(s3Url);
    const bucketUrl = `${bucketName}.s3.${url.hostname.split('.')[2]}.amazonaws.com`;

    // Ensure the URL matches the bucket format
    if (!url.hostname.includes(bucketUrl)) {
      throw new Error(
        'The provided URL does not match the expected S3 bucket format.',
      );
    }

    // Extract everything after the bucket name
    return decodeURIComponent(url.pathname.substring(1)); // Remove leading "/"
  } catch (error) {
    throw new Error(`Failed to extract S3 key: ${error.message}`);
  }
}
