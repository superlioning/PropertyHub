using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using PropertyHubAPI.DTO.Addresses;
using PropertyHubAPI.DTO.Property;
using PropertyHubAPI.Services;
using PropertyHubLibrary.Models;

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
        public async Task<ActionResult<IEnumerable<AddressDto>>> GetAddressesAsync()
        {
            var addresses = await _addressRepository.GetAddressesAsync();

            var results = _mapper.Map<IEnumerable<AddressDto>>(addresses);
            return Ok(results);
        }

        // Get all properties in the street
        [HttpGet("streetProperty/{streetNumber}/{streetName}/{unit?}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByStreetAsync(string streetNumber, string streetName, string? unit = null)
        {
            var properties = await _addressRepository.GetPropertiesByStreetAsync(streetNumber, streetName, unit);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get all properties in the city
        [HttpGet("cityProperty/{city}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByCityAsync(string city)
        {
            var properties = await _addressRepository.GetPropertiesByCityAsync(city);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get all properties in the postalCode
        [HttpGet("postalCodeProperty/{postalCode}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByPostalCodeAsync(string postalCode)
        {
            var properties = await _addressRepository.GetPropertiesByPostalCodeAsync(postalCode);
            if (!properties.Any())
            {
                return NotFound();
            }
            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Add address to the property 
        [HttpPost("{mls}/addAddress")]
        public async Task<IActionResult> AddAddressToPropertyAsync(string mls, [FromBody] AddressCreateDto addressCreateDto)
        {
            var address = _mapper.Map<Address>(addressCreateDto);

            var success = await _addressRepository.AddAddressToPropertyAsync(mls, address);

            if (!success)
            {
                return NotFound($"Property with ID {mls} not found.");
            }
            return Ok(new { Message = "Address created successfully." });
        }

        // Update address
        [HttpPut("{mls}/updateAddress")]
        public async Task<IActionResult> UpdateAddressInPropertyAsync(string mls, [FromBody] AddressUpdateDto addressUpdateDto)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            var updatedAddress = _mapper.Map<Address>(addressUpdateDto);

            // Update the address in the repository
            var success = await _addressRepository.UpdateAddressInPropertyAsync(mls, updatedAddress);

            if (success)
            {
                return Ok(new { Message = "Address updated successfully." });
            }
            else
            {
                return StatusCode(500, "An error occurred while updating the address.");
            }
        }

        // Patch address
        [HttpPatch("{mls}/patchAddress")]
        public async Task<IActionResult> PatchAddressInPropertyAsync(string mls, [FromBody] JsonPatchDocument<AddressUpdateDto> patchDocument)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            var addressToPatch = _mapper.Map<AddressUpdateDto>(property.Address);

            patchDocument.ApplyTo(addressToPatch, ModelState);

            if (!TryValidateModel(addressToPatch))
            {
                return ValidationProblem(ModelState);
            }

            var patchedAddress = _mapper.Map<Address>(addressToPatch);

            // Update the address in the repository
            var success = await _addressRepository.UpdateAddressInPropertyAsync(mls, patchedAddress);

            if (success)
            {
                return Ok(new { Message = "Address updated successfully." });
            }
            else
            {
                return StatusCode(500, "An error occurred while updating the address.");
            }
        }

        // Delete address in the property
        [HttpDelete("{mls}/deleteAddress")]
        public async Task<IActionResult> DeleteAddressFromPropertyAsync(string mls)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            var success = await _addressRepository.DeleteAddressFromPropertyAsync(mls);
            if (!success)
            {
                return NotFound();
            }

            return Ok(new { Message = "Address deleted from property successfully." });
        }
    }
}