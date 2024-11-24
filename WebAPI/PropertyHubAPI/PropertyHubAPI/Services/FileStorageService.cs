using Amazon.DynamoDBv2.DocumentModel;
using Amazon.S3.Transfer;
using Amazon.S3;
using PropertyHubLibrary.Connector;
using Amazon.S3.Model;

namespace PropertyHubAPI.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly AWSConnector _awsConnector;
        private readonly string _tableName = "Property";
        private readonly Table _table;
        private readonly String bucketName = "pdf-repository-for-assignment-2";

        public FileStorageService(AWSConnector awsConnector)
        {
            _awsConnector = awsConnector;
            _table = _awsConnector.LoadContentTable(_tableName);
        }

        public async Task<IEnumerable<string>> AddImagesToPropertyAsync(IEnumerable<IFormFile> imageUrls)
        {
            var uploadedImageUrls = new List<string>();

            try
            {
                foreach (var image in imageUrls)
                {
                    if (image.Length > 0)
                    {
                        var imageUrl = await UploadFileAsync(image);
                        uploadedImageUrls.Add(imageUrl);

                    }
                }

                return uploadedImageUrls;
            }
            catch (AmazonS3Exception s3Ex)
            {
                Console.WriteLine($"Error occurred while uploading images to S3: {s3Ex.Message}");
                Console.WriteLine(s3Ex.StackTrace);
                return null;
            }
        }

        public async Task<string> AddOneImageToPropertyAsync(IFormFile imageUrl)
        {
            if (imageUrl == null || imageUrl.Length == 0)
            {
                Console.WriteLine("No image uploaded");
                return null;
            }

            try
            {
                var uploadedImageUrl = await UploadFileAsync(imageUrl);

                return uploadedImageUrl;
            }
            catch (AmazonS3Exception s3Ex)
            {
                Console.WriteLine($"Error occurred while uploading image to S3: {s3Ex.Message}");
                Console.WriteLine(s3Ex.StackTrace);
                return null;
            }
        }

        public async Task DeleteOneImageFromPropertyAsync(string imageUrl)
        {
            try
            {
                await DeleteFileFromS3Async(imageUrl);
            }
            catch (AmazonS3Exception s3Ex)
            {
                Console.WriteLine($"Error occurred while deleting image from S3: {s3Ex.Message}");
                Console.WriteLine(s3Ex.StackTrace);
            }
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            try
            {
                var fileName = Path.GetFileName(file.FileName);
                var key = fileName;

                var uploadRequest = new TransferUtilityUploadRequest
                {
                    InputStream = file.OpenReadStream(),
                    Key = key,
                    BucketName = bucketName,
                    CannedACL = S3CannedACL.PublicRead
                };

                var fileTransferUtility = new TransferUtility(_awsConnector.S3Client);
                await fileTransferUtility.UploadAsync(uploadRequest);

                return $"https://{bucketName}.s3.amazonaws.com/{key}";
            }
            catch (AmazonS3Exception s3Ex)
            {
                Console.WriteLine($"Amazon S3 error: {s3Ex.Message}");
                return $"Error uploading file: {s3Ex.Message}";
            }
        }

        public async Task DeleteFileFromS3Async(string fileUrl)
        {
            try
            {
                var key = Path.GetFileName(new Uri(fileUrl).AbsolutePath);
                var deleteObjectRequest = new DeleteObjectRequest
                {
                    BucketName = bucketName,
                    Key = key
                };

                await _awsConnector.S3Client.DeleteObjectAsync(deleteObjectRequest);
            }
            catch (AmazonS3Exception s3Ex)
            {
                Console.WriteLine($"Amazon S3 error: {s3Ex.Message}");
                throw new Exception($"Error deleting file from S3: {s3Ex.Message}");
            }
        }
    }
}