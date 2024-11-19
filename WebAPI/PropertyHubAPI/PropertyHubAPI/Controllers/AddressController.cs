using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using PropertyHubAPI.DTO.Addresses;
using PropertyHubAPI.DTO.Property;
using PropertyHubAPI.Services;

namespace PropertyHubAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly IPropertyHubRespository _propertyHubRespository;
        private readonly IAddressRepository _addressRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IMapper _mapper;

        public AddressController(IPropertyHubRespository propertyHubRespository, IAddressRepository addressRepository, IFileStorageService fileStorageService, IMapper mapper)
        {
            _propertyHubRespository = propertyHubRespository;
            _addressRepository = addressRepository;
            _fileStorageService = fileStorageService;
            _mapper = mapper;
        }

        // Get all addresses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressDto>>> GetAllAddresses()
        {
            var addresses = await _addressRepository.GetAddressesAsync();
            var results = _mapper.Map<IEnumerable<AddressDto>>(addresses);
            return Ok(results);
        }

        // Get addresses in the city
        [HttpGet("cityAddress/{city}")]
        public async Task<ActionResult<IEnumerable<AddressDto>>> GetAddressByCity(string city)
        {
            var addresses = await _addressRepository.GetAddressByCityAsync(city);
            if (addresses == null || !addresses.Any())
            {
                return NotFound();
            }
            var results = _mapper.Map<IEnumerable<AddressDto>>(addresses);
            return Ok(results);
        }

        // Get all properties in the city
        [HttpGet("cityProperty/{city}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertyByCityAsync(string city)
        {
            var properties = await _addressRepository.GetPropertiesByCityAsync(city);
            if (properties == null || !properties.Any())
            {
                return NotFound();
            }
            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties by street number and street name
        [HttpGet("streetProperty/{streetNumber}/{streetName}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertyByStreetAsync(string streetNumber, string streetName)
        {
            var properties = await _addressRepository.GetPropertiesByStreetAsync(streetNumber, streetName);
            if (properties == null || !properties.Any())
            {
                return NotFound();
            }
            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get all properties in the postal code
        [HttpGet("postalCodeProperty/{postalCode}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertyByPostalCodeAsync(string postalCode)
        {
            var properties = await _addressRepository.GetPropertiesByPostalCodeAsync(postalCode);
            if (properties == null || !properties.Any())
            {
                return NotFound();
            }
            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Add address to the property
        [HttpPost("{MLS}/address")]
        public async Task<IActionResult> AddAddressToProperty(string MLS, [FromBody] AddressDto addressDto)
        {
            var success = await _addressRepository.AddAddressToPropertyAsync(MLS, addressDto);

            if (!success)
            {
                return NotFound($"Property with ID {MLS} not found.");
            }
            return Ok(new { Message = "Address created successfully.", AddressDto = addressDto });
        }

        // Update address
        [HttpPut("{MLS}/updateAddress")]
        public async Task<IActionResult> UpdateAddress(string MLS, [FromBody] AddressDto addressDto)
        {
            var property = await _propertyHubRespository.GetPropertyByIdAsync(MLS);
            if (property == null)
            {
                return NotFound();
            }

            var updateResult = await _addressRepository.UpdateAddress(MLS, addressDto);

            if (updateResult)
                return Ok("Address updated successfully.");
            else
                return StatusCode(500, "An error occurred while updating the address.");
        }

        // Patch address
        [HttpPatch("{MLS}/updateAddress")]
        public async Task<IActionResult> UpdateAddressPatch(string MLS, [FromBody] JsonPatchDocument<AddressDto> patchDoc)
        {
            var property = await _propertyHubRespository.GetPropertyByIdAsync(MLS);
            if (property == null)
            {
                return NotFound();
            }

            var propertyDto = _mapper.Map<PropertyDto>(property);
            if (propertyDto.Address == null)
            {
                return BadRequest("No address available to update.");
            }

            var addressToUpdate = _mapper.Map<AddressDto>(propertyDto.Address);
            patchDoc.ApplyTo(addressToUpdate, ModelState);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updateResult = await _addressRepository.UpdateAddress(MLS, addressToUpdate);

            if (updateResult)
                return Ok(new { Message = "Address updated successfully." });
            else
                return StatusCode(500, "An error occurred while updating the address.");
        }

        // Delete address in the property
        [HttpDelete("{MLS}/deleteAddress")]
        public async Task<IActionResult> DeleteAddressFromProperty(string MLS)
        {
            var property = await _propertyHubRespository.GetPropertyByIdAsync(MLS);
            if (property == null)
            {
                return NotFound();
            }

            var success = await _addressRepository.DeleteAddressFromPropertyAsync(MLS);

            if (!success)
            {
                return NotFound($"Cannot delete address from the property ID: {MLS}.");
            }

            return Ok(new { Message = "Address deleted from property successfully." });
        }
    }
}