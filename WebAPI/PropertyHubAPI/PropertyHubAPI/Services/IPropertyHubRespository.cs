using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public interface IPropertyHubRespository
    {
        Task<IEnumerable<Property>> GetPropertiesAsync();
        Task<Property> GetPropertyByMLSAsync(string mls);
        Task<IEnumerable<Property>> GetPropertiesByTypeAsync(string type);
        Task<IEnumerable<Property>> GetPropertiesByPriceLimitAsync(decimal price);
        Task<IEnumerable<Property>> GetPropertiesByBedroomsLimitAsync(int bedrooms);
        Task<IEnumerable<Property>> GetPropertiesByBathroomsLimitAsync(int bathrooms);
        Task<IEnumerable<Property>> GetPropertiesByParkingsLimitAsync(int parkings);
        Task<IEnumerable<Property>> GetPropertiesBySizeLimitAsync(int size);
        Task<IEnumerable<Property>> GetPropertiesByYearBuiltLimitAsync(int yearBuilt);
        Task<IEnumerable<Property>> GetPropertiesByTaxLimitAsync(decimal tax);
        Task<IEnumerable<Property>> GetPropertiesByStatusAsync(string status);

        Task<bool> AddPropertyAsync(Property property);
        Task<bool> UpdatePropertyAsync(Property updatedProperty);
        Task<bool> DeletePropertyAsync(string mls);
    }
}