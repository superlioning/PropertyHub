using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using PropertyHubLibrary.Connector;
using PropertyHubAPI.DTO.Features;
using PropertyHubAPI.DTO.Property;

namespace PropertyHubAPI.Services
{
    public class FeatureRepository : IFeatureRepository
    {
        private readonly AWSConnector _awsConnector;
        private readonly string _tableName = "Property";
        private readonly Table _table;

        public FeatureRepository(AWSConnector awsConnector)
        {
            _awsConnector = awsConnector;
            _table = _awsConnector.LoadContentTable(_tableName);
        }

        public async Task<IEnumerable<FeatureDto>> GetFeaturesAsync()
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<PropertyDto>(new List<ScanCondition>()).GetRemainingAsync();

            // Extract the Feature attribute from each Property item and map to FeatureDto
            var features = properties
                .Where(property => property.Feature != null)
                .Select(property => property.Feature)
                .ToList();

            return features!;
        }

        public async Task<IEnumerable<FeatureDto>> GetFeaturesByWalkScoreAsync(int walkScore)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<PropertyDto>(new List<ScanCondition>()).GetRemainingAsync();

            // Extract the Feature attribute from each Property item and filter by WalkScore
            var features = properties
                .Where(property => property.Feature != null && property.Feature.WalkScore >= walkScore)
                .Select(property => property.Feature)
                .ToList();

            return features!;
        }

        public async Task<IEnumerable<FeatureDto>> GetFeaturesByTransitScoreAsync(int transitScore)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<PropertyDto>(new List<ScanCondition>()).GetRemainingAsync();

            // Extract the Feature attribute from each Property item and filter by TransitScore
            var features = properties
                .Where(property => property.Feature != null && property.Feature.TransitScore >= transitScore)
                .Select(property => property.Feature)
                .ToList();

            return features!;
        }

        public async Task<IEnumerable<FeatureDto>> GetFeaturesByBikeScoreAsync(int bikeScore)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<PropertyDto>(new List<ScanCondition>()).GetRemainingAsync();

            // Extract the Feature attribute from each Property item and filter by BikeScore
            var features = properties
                .Where(property => property.Feature != null && property.Feature.BikeScore >= bikeScore)
                .Select(property => property.Feature)
                .ToList();

            return features!;
        }

        public async Task<IEnumerable<FeatureDto>> GetFeaturesByEducationScoreAsync(int educationScore)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<PropertyDto>(new List<ScanCondition>()).GetRemainingAsync();

            // Extract the Feature attribute from each Property item and filter by EducationScore
            var features = properties
                .Where(property => property.Feature != null && property.Feature.EducationScore >= educationScore)
                .Select(property => property.Feature)
                .ToList();

            return features!;
        }

        public async Task<bool> AddFeatureToPropertyAsync(string MLS, FeatureDto featureDto)
        {
            DynamoDBContext context = _awsConnector.Context;
            var property = await context.LoadAsync<PropertyDto>(MLS);
            if (property == null) return false;

            // Add the feature to the property
            property.Feature = featureDto;

            try
            {
                await context.SaveAsync(property);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while adding feature: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> UpdateFeature(string MLS, FeatureDto updatedFeature)
        {
            try
            {
                DynamoDBContext context = _awsConnector.Context;

                PropertyDto property = await context.LoadAsync<PropertyDto>(MLS);
                if (property == null) return false;

                // Update the feature
                property.Feature = updatedFeature;

                await context.SaveAsync(property);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while updating feature: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteFeatureFromPropertyAsync(string MLS)
        {
            DynamoDBContext context = _awsConnector.Context;

            var property = await context.LoadAsync<PropertyDto>(MLS);
            if (property == null) return false;

            property.Feature = null;

            try
            {
                await context.SaveAsync(property);
                return true; // Deletion of feature successful
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while deleting feature: {ex.Message}");
                return false; // Deletion failed
            }
        }
    }
}