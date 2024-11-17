using PropertyHubAPI.DTO.Addresses;
using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public interface IAddressRepository
    {
        Task<IEnumerable<Address>> GetAddressesAsync();
        Task<IEnumerable<Address>> GetAddressByCityAsync(string city);
        Task<IEnumerable<Property>> GetPropertiesByCityAsync(string city);
        Task<IEnumerable<Property>> GetPropertiesByAreaAsync(string areaCode);

        Task<bool> UpdateAddress(string propertyId, Address updatedAddress);
        Task<bool> AddAddressToPropertyAsync(string propertyId, AddressDto addressDto);
        Task<bool> DeleteAddressFromPropertyAsync(string propertyId);
    }
}