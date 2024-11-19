using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using PropertyHubLibrary.Connector;
using PropertyHubAPI.DTO.Addresses;
using PropertyHubAPI.DTO.Property;

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

        public async Task<IEnumerable<AddressDto>> GetAddressesAsync()
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<PropertyDto>(new List<ScanCondition>()).GetRemainingAsync();

            // Extract the Address attribute from each Property item
            var addresses = properties
                .Where(property => property.Address != null)
                .Select(property => property.Address)
                .ToList();

            return addresses;
        }

        public async Task<IEnumerable<AddressDto>> GetAddressByCityAsync(string city)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var properties = await context.ScanAsync<PropertyDto>(new List<ScanCondition>()).GetRemainingAsync();

            // Extract the Address attribute from each Property item and filter by city
            var addressesInCity = properties
                .Where(property => property.Address != null)
                .Select(property => property.Address)
                .Where(address => address.City.Equals(city, StringComparison.OrdinalIgnoreCase))
                .ToList();

            return addressesInCity;
        }

        public async Task<IEnumerable<PropertyDto>> GetPropertiesByStreetAsync(string streetNumber, string streetName)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var allProperties = await context.ScanAsync<PropertyDto>(new List<ScanCondition>()).GetRemainingAsync();

            // Filter properties by street number and street name
            var propertiesOnStreet = allProperties
                .Where(property => property.Address != null &&
                                   property.Address.StreetNumber.Equals(streetNumber, StringComparison.OrdinalIgnoreCase) &&
                                   property.Address.StreetName.Equals(streetName, StringComparison.OrdinalIgnoreCase))
                .ToList();

            return propertiesOnStreet;
        }

        public async Task<IEnumerable<PropertyDto>> GetPropertiesByCityAsync(string city)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var allProperties = await context.ScanAsync<PropertyDto>(new List<ScanCondition>()).GetRemainingAsync();

            // Filter properties by city
            var propertiesInCity = allProperties
                .Where(property => property.Address != null &&
                                   property.Address.City.Equals(city, StringComparison.OrdinalIgnoreCase))
                .ToList();

            return propertiesInCity;
        }

        public async Task<IEnumerable<PropertyDto>> GetPropertiesByPostalCodeAsync(string postalCode)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Perform a scan operation to retrieve the Property items
            var allProperties = await context.ScanAsync<PropertyDto>(new List<ScanCondition>()).GetRemainingAsync();

            // Filter properties by postal code
            var propertiesInPostalCode = allProperties
                .Where(property => property.Address != null &&
                                   property.Address.PostalCode.Equals(postalCode, StringComparison.OrdinalIgnoreCase))
                .ToList();
            return propertiesInPostalCode;
        }

        public async Task<bool> UpdateAddress(string MLS, AddressDto updatedAddress)
        {
            try
            {
                DynamoDBContext context = _awsConnector.Context;

                PropertyDto property = await context.LoadAsync<PropertyDto>(MLS);
                if (property == null) return false;

                // Update the address
                property.Address = updatedAddress;

                await context.SaveAsync(property);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while updating address: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> AddAddressToPropertyAsync(string MLS, AddressDto addressDto)
        {
            DynamoDBContext context = _awsConnector.Context;
            var property = await context.LoadAsync<PropertyDto>(MLS);
            if (property == null) return false;

            property.Address = addressDto;

            try
            {
                await context.SaveAsync(property);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while adding address: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteAddressFromPropertyAsync(string MLS)
        {
            DynamoDBContext context = _awsConnector.Context;

            // Retrieve the property by MLS
            var property = await context.LoadAsync<PropertyDto>(MLS);
            if (property == null)
            {
                return false; // Property not found
            }

            // Replace address fields with "N/A"
            property.Address = new AddressDto
            {
                StreetNumber = "N/A",
                StreetName = "N/A",
                City = "N/A",
                Province = "N/A",
                PostalCode = "N/A",
                Country = "N/A"
            };

            try
            {
                // Save the updated property
                await context.SaveAsync(property);
                return true; // Deletion of address successful
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while deleting address: {ex.Message}");
                return false; // Deletion failed
            }
        }
    }
}