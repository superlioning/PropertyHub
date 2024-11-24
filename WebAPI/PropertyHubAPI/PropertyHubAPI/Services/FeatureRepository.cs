using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using PropertyHubLibrary.Connector;
using PropertyHubLibrary.Models;

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

        public async Task<IEnumerable<Feature>> GetFeaturesAsync()
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<Property>(new List<ScanCondition>()).GetRemainingAsync();

            // Extract the Feature attribute from each Property item
            var features = properties
             .Where(property => property.Feature != null)
             .Select(property => property.Feature)
             .ToList();

            return features;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByWalkScoreAsync(int walkScore)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<Property>(new List<ScanCondition>()).GetRemainingAsync();

            // Filter properties by walkScore
            var propertiesWithWalkScore = properties
                .Where(property => property.Feature != null && property.Feature.WalkScore >= walkScore)
                .ToList();

            return propertiesWithWalkScore;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByTransitScoreAsync(int transitScore)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<Property>(new List<ScanCondition>()).GetRemainingAsync();

            // Filter properties by transitScore
            var propertiesWithTransitScore = properties
                .Where(property => property.Feature != null && property.Feature.TransitScore >= transitScore)
                .ToList();

            return propertiesWithTransitScore;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByBikeScoreAsync(int bikeScore)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<Property>(new List<ScanCondition>()).GetRemainingAsync();

            // Filter properties by bikeScore
            var propertiesWithBikeScore = properties
                .Where(property => property.Feature != null && property.Feature.BikeScore >= bikeScore)
                .ToList();

            return propertiesWithBikeScore;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByEducationScoreAsync(int educationScore)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<Property>(new List<ScanCondition>()).GetRemainingAsync();

            // Filter properties by educationScore
            var propertiesWithEducationScore = properties
                .Where(property => property.Feature != null && property.Feature.EducationScore >= educationScore)
                .ToList();

            return propertiesWithEducationScore;
        }

        public async Task<bool> AddFeatureToPropertyAsync(string mls, Feature feature)
        {
            DynamoDBContext context = _awsConnector.Context;

            var property = await context.LoadAsync<Property>(mls);
            if (property == null) return false;

            if (property.Feature == null)
            {
                property.Feature = feature;
            }
            else
            {
                return false;
            }


            try
            {
                await context.SaveAsync(property);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> UpdateFeatureInPropertyAsync(string mls, Feature updatedFeature)
        {
            try
            {
                DynamoDBContext context = _awsConnector.Context;

                Property property = await context.LoadAsync<Property>(mls);
                if (property == null) return false;

                if (property.Feature == null)
                {
                    return false;
                }
                else
                {
                    property.Feature = updatedFeature;
                }

                await context.SaveAsync(property);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while updating feature: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteFeatureFromPropertyAsync(string mls)
        {
            DynamoDBContext context = _awsConnector.Context;

            var property = await context.LoadAsync<Property>(mls);
            if (property == null) return false;

            property.Feature = null;

            try
            {
                await context.SaveAsync(property);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}