using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public interface IPropertyHubRespository
    {
        Task<IEnumerable<Property>> GetPropertiesAsync();
        Task<Property> GetPropertyByIdAsync(string mls);
        Task<IEnumerable<Property>> GetPropertyByTypeAsync(string type);
        Task<IEnumerable<Property>> GetPropertyByPriceRangeAsync(decimal minPrice, decimal maxPrice);
        Task<IEnumerable<Property>> GetPropertyByStatusAsync(string status);

        Task<Property> AddPropertyAsync(Property property);
        Task<bool> UpdatePropertyAsync(Property updatedProperty);
        Task<bool> DeletePropertyAsync(string mls);
    }
}