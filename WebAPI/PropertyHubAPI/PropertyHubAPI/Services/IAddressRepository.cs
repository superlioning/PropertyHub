using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public interface IAddressRepository
    {
        Task<IEnumerable<Address>> GetAddressesAsync();
        Task<IEnumerable<Property>> GetPropertiesByStreetAsync(string streetNumber, string streetName, string? unit = null);
        Task<IEnumerable<Property>> GetPropertiesByCityAsync(string city);
        Task<IEnumerable<Property>> GetPropertiesByPostalCodeAsync(string PostalCode);

        Task<bool> AddAddressToPropertyAsync(string mls, Address address);
        Task<bool> UpdateAddress(string mls, Address updatedAddress);
        Task<bool> DeleteAddressFromPropertyAsync(string mls);
    }
}