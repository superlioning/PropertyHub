using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using PropertyHubLibrary.Connector;
using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public class PropertyHubRespository : IPropertyHubRespository
    {
        private readonly AWSConnector _awsConnector;
        private readonly string _tableName = "Property";
        private readonly Table _table;

        public PropertyHubRespository(AWSConnector awsConnector)
        {
            _awsConnector = awsConnector;
            _table = _awsConnector.LoadContentTable(_tableName);
        }

        public async Task<IEnumerable<Property>> GetPropertiesAsync()
        {
            DynamoDBContext context = _awsConnector.Context;

            var properties = await context.ScanAsync<Property>(new List<ScanCondition>()).GetRemainingAsync();
            return properties;
        }

        public async Task<Property> GetPropertyByMLSAsync(string mls)
        {
            DynamoDBContext context = _awsConnector.Context;

            var property = await context.LoadAsync<Property>(mls);
            return property;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByTypeAsync(string type)
        {
            DynamoDBContext context = _awsConnector.Context;

            var conditions = new List<ScanCondition>
                {
                    new ScanCondition("Type", ScanOperator.Equal, type)
                };

            var properties = await context.ScanAsync<Property>(conditions).GetRemainingAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByPriceLimitAsync(decimal price)
        {
            DynamoDBContext context = _awsConnector.Context;

            var conditions = new List<ScanCondition>
                {
                    new ScanCondition("Price", ScanOperator.LessThanOrEqual, price)
                };

            var properties = await context.ScanAsync<Property>(conditions).GetRemainingAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByBedroomsLimitAsync(int bedrooms)
        {
            DynamoDBContext context = _awsConnector.Context;

            var conditions = new List<ScanCondition>
                {
                    new ScanCondition("Bedrooms", ScanOperator.GreaterThanOrEqual, bedrooms)
                };

            var properties = await context.ScanAsync<Property>(conditions).GetRemainingAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByBathroomsLimitAsync(int bathrooms)
        {
            DynamoDBContext context = _awsConnector.Context;

            var conditions = new List<ScanCondition>
                {
                    new ScanCondition("Bathrooms", ScanOperator.GreaterThanOrEqual, bathrooms)
                };

            var properties = await context.ScanAsync<Property>(conditions).GetRemainingAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByParkingsLimitAsync(int parkings)
        {
            DynamoDBContext context = _awsConnector.Context;

            var conditions = new List<ScanCondition>
                {
                    new ScanCondition("Parkings", ScanOperator.GreaterThanOrEqual, parkings)
                };

            var properties = await context.ScanAsync<Property>(conditions).GetRemainingAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetPropertiesBySizeLimitAsync(int size)
        {
            DynamoDBContext context = _awsConnector.Context;

            var conditions = new List<ScanCondition>
                {
                    new ScanCondition("Size", ScanOperator.GreaterThanOrEqual, size)
                };

            var properties = await context.ScanAsync<Property>(conditions).GetRemainingAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByYearBuiltLimitAsync(int yearBuilt)
        {
            DynamoDBContext context = _awsConnector.Context;

            var conditions = new List<ScanCondition>
                {
                    new ScanCondition("YearBuilt", ScanOperator.LessThanOrEqual, yearBuilt)
                };

            var properties = await context.ScanAsync<Property>(conditions).GetRemainingAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByTaxLimitAsync(decimal tax)
        {
            DynamoDBContext context = _awsConnector.Context;

            var conditions = new List<ScanCondition>
                {
                    new ScanCondition("Tax", ScanOperator.LessThanOrEqual, tax)
                };

            var properties = await context.ScanAsync<Property>(conditions).GetRemainingAsync();
            return properties;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByStatusAsync(string status)
        {
            DynamoDBContext context = _awsConnector.Context;

            var conditions = new List<ScanCondition>
                {
                    new ScanCondition("Status", ScanOperator.Equal, status)
                };

            var properties = await context.ScanAsync<Property>(conditions).GetRemainingAsync();
            return properties;
        }

        public async Task<bool> AddPropertyAsync(Property property)
        {
            DynamoDBContext context = _awsConnector.Context;

            try
            {
                await context.SaveAsync(property);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while adding property: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> UpdatePropertyAsync(Property updatedProperty)
        {
            DynamoDBContext context = _awsConnector.Context;

            try
            {
                var existingProperty = await context.LoadAsync<Property>(updatedProperty.MLS);
                if (existingProperty == null)
                {
                    return false;
                }

                await context.SaveAsync(updatedProperty);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while updating property: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeletePropertyAsync(string mls)
        {
            DynamoDBContext context = _awsConnector.Context;

            try
            {
                var property = await context.LoadAsync<Property>(mls);
                if (property == null)
                {
                    return false;
                }

                await context.DeleteAsync(property);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while deleting property: {ex.Message}");
                return false;
            }
        }
    }
}