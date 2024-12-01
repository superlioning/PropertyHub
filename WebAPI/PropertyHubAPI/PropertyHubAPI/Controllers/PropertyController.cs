using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PropertyHubAPI.Services;
using PropertyHubLibrary.Models;
using PropertyHubAPI.DTO.Property;
using Microsoft.AspNetCore.JsonPatch;

namespace PropertyHubAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyHubRespository _propertyHubRespository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IMapper _mapper;

        public PropertyController(IPropertyHubRespository propertyHubRespository, IFileStorageService fileStorageService, IMapper mapper)
        {
            _propertyHubRespository = propertyHubRespository;
            _fileStorageService = fileStorageService;
            _mapper = mapper;
        }

        // Get all properties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesAsync()
        {
            var properties = await _propertyHubRespository.GetPropertiesAsync();
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get property by MLS
        [HttpGet("{mls}")]
        public async Task<ActionResult<PropertyDto>> GetPropertyByMLSAsync(string mls)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound($"Property with MLS {mls} not found.");
            }

            var results = _mapper.Map<PropertyDto>(property);
            return Ok(results);
        }

        // Get properties by type
        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByTypeAsync(string type)
        {
            var properties = await _propertyHubRespository.GetPropertiesByTypeAsync(type);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties by price limit
        [HttpGet("price/{price}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByPriceLimitAsync(decimal price)
        {
            var properties = await _propertyHubRespository.GetPropertiesByPriceLimitAsync(price);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties by bedrooms limit
        [HttpGet("bedrooms/{bedrooms}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByBedroomsLimitAsync(int bedrooms)
        {
            var properties = await _propertyHubRespository.GetPropertiesByBedroomsLimitAsync(bedrooms);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties by bathrooms limit
        [HttpGet("bathrooms/{bathrooms}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByBathroomsLimitAsync(int bathrooms)
        {
            var properties = await _propertyHubRespository.GetPropertiesByBathroomsLimitAsync(bathrooms);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties by parkings limit
        [HttpGet("parkings/{parkings}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByParkingsLimitAsync(int parkings)
        {
            var properties = await _propertyHubRespository.GetPropertiesByParkingsLimitAsync(parkings);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties by size limit
        [HttpGet("size/{size}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesBySizeLimitAsync(int size)
        {
            var properties = await _propertyHubRespository.GetPropertiesBySizeLimitAsync(size);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties by year built limit
        [HttpGet("yearBuilt/{yearBuilt}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByYearBuiltLimitAsync(int yearBuilt)
        {
            var properties = await _propertyHubRespository.GetPropertiesByYearBuiltLimitAsync(yearBuilt);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties by tax limit
        [HttpGet("tax/{tax}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByTaxLimitAsync(decimal tax)
        {
            var properties = await _propertyHubRespository.GetPropertiesByTaxLimitAsync(tax);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties by status
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByStatusAsync(string status)
        {
            var properties = await _propertyHubRespository.GetPropertiesByStatusAsync(status);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Add property
        [HttpPost]
        public async Task<IActionResult> AddPropertyAsync([FromBody] PropertyCreateDto propertyCreateDto)
        {
            var property = _mapper.Map<Property>(propertyCreateDto);

            var success = await _propertyHubRespository.AddPropertyAsync(property);

            if (!success)
            {
                return StatusCode(500, "An error occurred while creating the property.");
            }

            return Ok(new { Message = "Property added successfully." });
        }

        // Update property
        [HttpPut("{mls}")]
        public async Task<IActionResult> UpdatePropertyAsync(string mls, [FromBody] PropertyUpdateDto propertyUpdateDto)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            var updatedProperty = _mapper.Map<Property>(propertyUpdateDto);
            updatedProperty.MLS = mls;
            updatedProperty.DateListed = property.DateListed;
            var success = await _propertyHubRespository.UpdatePropertyAsync(updatedProperty);

            if (!success)
            {
                return StatusCode(500, "An error occurred while updating the property.");
            }

            return Ok(new { Message = "Property updated successfully." });
        }

        // Patch property
        [HttpPatch("{mls}")]
        public async Task<IActionResult> PatchPropertyAsync(string mls, [FromBody] JsonPatchDocument<PropertyUpdateDto> patchDocument)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            var propertyToPatch = _mapper.Map<PropertyUpdateDto>(property);

            patchDocument.ApplyTo(propertyToPatch, ModelState);

            if (!TryValidateModel(propertyToPatch))
            {
                return ValidationProblem(ModelState);
            }

            // Map the updated DTO back to the entity
            _mapper.Map(propertyToPatch, property);

            var success = await _propertyHubRespository.UpdatePropertyAsync(property);

            if (!success)
            {
                return StatusCode(500, "An error occurred while updating the property.");
            }

            return Ok(new { Message = "Property updated successfully." });
        }

        // Delete property 
        [HttpDelete("{mls}")]
        public async Task<IActionResult> DeletePropertyAsync(string mls)
        {
            // First get the property to access its images
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound($"Property with MLS {mls} not found.");
            }

            try
            {
                // Delete all associated images from S3
                if (property.ImageUrls != null && property.ImageUrls.Any())
                {
                    foreach (var imageUrl in property.ImageUrls)
                    {
                        await _fileStorageService.DeleteOneImageFromPropertyAsync(imageUrl);
                    }
                }

                // Delete the property from DynamoDB
                var success = await _propertyHubRespository.DeletePropertyAsync(mls);

                if (!success)
                {
                    return StatusCode(500, "An error occurred while deleting the property.");
                }

                return Ok(new { Message = "Property and associated images deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting the property: {ex.Message}");
            }
        }

        // Add New Images to the Existing Property
        [HttpPost("{mls}/images")]
        public async Task<IActionResult> AddPropertyImagesAsync(string mls, [FromForm] IEnumerable<IFormFile> imageUrls)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            if (!imageUrls.Any())
            {
                return BadRequest("No files were selected for upload.");
            }

            try
            {
                var uploadedImageUrls = await _fileStorageService.AddImagesToPropertyAsync(imageUrls);

                // Ensure that the uploaded image URLs are properly assigned to the property
                property.ImageUrls.AddRange(uploadedImageUrls);

                var success = await _propertyHubRespository.UpdatePropertyAsync(property);
                if (!success)
                {
                    return StatusCode(500, "Error updating property images in the database.");
                }

                return Ok(new { Message = "Property images added successfully.", Property = property });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while adding property images.");
            }
        }

        // Update property images
        [HttpPut("{mls}/images")]
        public async Task<IActionResult> UpdatePropertyImageAsync(string mls, string existingImageUrl, IFormFile newImage)
        {
            // Validate property exists
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            // Validate the existing image URL
            if (string.IsNullOrWhiteSpace(existingImageUrl))
            {
                return BadRequest("Existing image URL is required.");
            }

            // Validate the new image file
            if (newImage == null || newImage.Length == 0)
            {
                return BadRequest("New image file is required.");
            }

            try
            {
                // Save the new image file and get its URL
                var newImageUrl = await _fileStorageService.AddOneImageToPropertyAsync(newImage);

                // Find the existing image in the property's image list and replace it
                var imageIndex = property.ImageUrls.IndexOf(existingImageUrl);
                if (imageIndex != -1)
                {
                    property.ImageUrls[imageIndex] = newImageUrl;
                }
                else
                {
                    return BadRequest("The specified existing image URL does not match any images of the property.");
                }

                // Update the property in the repository
                var success = await _propertyHubRespository.UpdatePropertyAsync(property);
                if (!success)
                {
                    return StatusCode(500, "Error updating the property image in the database.");
                }

                return Ok(new { Message = "Property image replaced successfully.", NewImageUrl = newImageUrl });
            }
            catch (Exception ex)
            {
                // Log the exception and return an error response
                return StatusCode(500, "An error occurred while replacing the property image.");
            }
        }

        //Delete property images
        [HttpDelete("{mls}/images")]
        public async Task<IActionResult> DeletePropertyImagesAsync(string mls, [FromBody] IEnumerable<string> imageUrls)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            if (imageUrls == null || !imageUrls.Any())
            {
                return BadRequest("No image URLs provided.");
            }

            var imagesToRemove = property.ImageUrls.Where(url => imageUrls.Contains(url)).ToList();
            if (!imagesToRemove.Any())
            {
                return BadRequest("None of the provided image URLs match the property's images.");
            }

            foreach (var imageUrl in imagesToRemove)
            {
                // Logic to delete the image from storage
                await _fileStorageService.DeleteOneImageFromPropertyAsync(imageUrl);

                // Remove the image URL from the property's image list
                property.ImageUrls.Remove(imageUrl);
            }

            var success = await _propertyHubRespository.UpdatePropertyAsync(property);
            if (!success)
            {
                return StatusCode(500, "An error occurred while updating the property.");
            }

            return Ok($"Images successfully deleted from property {mls}.");
        }
    }
}