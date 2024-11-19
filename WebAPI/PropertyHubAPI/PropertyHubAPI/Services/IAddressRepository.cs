using PropertyHubAPI.DTO.Addresses;
using PropertyHubAPI.DTO.Property;

namespace PropertyHubAPI.Services
{
    public interface IAddressRepository
    {
        Task<IEnumerable<AddressDto>> GetAddressesAsync();
        Task<IEnumerable<AddressDto>> GetAddressByCityAsync(string city);
        Task<IEnumerable<PropertyDto>> GetPropertiesByStreetAsync(string streetNumber, string streetName);
        Task<IEnumerable<PropertyDto>> GetPropertiesByCityAsync(string city);
        Task<IEnumerable<PropertyDto>> GetPropertiesByPostalCodeAsync(string PostalCode);

        Task<bool> UpdateAddress(string MLS, AddressDto updatedAddress);
        Task<bool> AddAddressToPropertyAsync(string MLS, AddressDto addressDto);
        Task<bool> DeleteAddressFromPropertyAsync(string MLS);
    }
}