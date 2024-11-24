using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using PropertyHubLibrary.Connector;
using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public class AddressRepository : IAddressRepository
    {
        private readonly AWSConnector _awsConnector;
        private readonly string _tableName = "Property";
        private readonly Table _table;

        public AddressRepository(AWSConnector awsConnector)
        {
            _awsConnector = awsConnector;
            _table = _awsConnector.LoadContentTable(_tableName);
        }

        public async Task<IEnumerable<Address>> GetAddressesAsync()
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<Property>(new List<ScanCondition>()).GetRemainingAsync();

            // Extract the Address attribute from each Property item
            var addresses = properties
             .Where(property => property.Address != null)
             .Select(property => property.Address)
            .ToList();

            return addresses;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByStreetAsync(string streetNumber, string streetName, string? unit = null)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<Property>(new List<ScanCondition>()).GetRemainingAsync();

            // Filter properties by street number and name
            var propertiesOnStreet = properties
                .Where(property => property.Address != null &&
                                   property.Address.StreetNumber.Equals(streetNumber, StringComparison.OrdinalIgnoreCase) &&
                                   property.Address.StreetName.Equals(streetName, StringComparison.OrdinalIgnoreCase))
                .ToList();

            // If unit is provided, filter properties by unit number
            if (unit != null)
            {
                propertiesOnStreet = propertiesOnStreet
                    .Where(property => property.Address.Unit.Equals(unit, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            return propertiesOnStreet;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByCityAsync(string city)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<Property>(new List<ScanCondition>()).GetRemainingAsync();

            // Filter properties by city
            var propertiesInCity = properties
                .Where(property => property.Address != null &&
                                   property.Address.City.Equals(city, StringComparison.OrdinalIgnoreCase))
                .ToList();

            return propertiesInCity;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByPostalCodeAsync(string postalCode)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<Property>(new List<ScanCondition>()).GetRemainingAsync();

            // Filter properties by PostalCode
            var propertiesInPostalCode = properties
                .Where(property => property.Address != null &&
                                   property.Address.PostalCode.Equals(postalCode, StringComparison.OrdinalIgnoreCase))
            .ToList();
            return propertiesInPostalCode;
        }

        public async Task<bool> AddAddressToPropertyAsync(string mls, Address address)
        {
            DynamoDBContext context = _awsConnector.Context;

            var property = await context.LoadAsync<Property>(mls);
            if (property == null) return false;

            if (property.Address == null)
            {
                property.Address = address;
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

        public async Task<bool> UpdateAddressInPropertyAsync(string mls, Address updatedAddress)
        {
            try
            {
                DynamoDBContext context = _awsConnector.Context;

                Property property = await context.LoadAsync<Property>(mls);
                if (property == null) return false;

                if (property.Address == null)
                {
                    return false;
                }
                else
                {
                    property.Address = updatedAddress;
                }

                await context.SaveAsync(property);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while updating address: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteAddressFromPropertyAsync(string mls)
        {
            DynamoDBContext context = _awsConnector.Context;

            var property = await context.LoadAsync<Property>(mls);
            if (property == null)
            {
                return false;
            }

            property.Address = null;

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