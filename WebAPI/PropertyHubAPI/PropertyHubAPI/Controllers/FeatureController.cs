using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using PropertyHubAPI.DTO.Features;
using PropertyHubAPI.DTO.Property;
using PropertyHubAPI.Services;
using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeatureController : ControllerBase
    {
        private readonly IPropertyHubRespository _propertyHubRespository;
        private readonly IFeatureRepository _featureRepository;
        private readonly IMapper _mapper;

        public FeatureController(IPropertyHubRespository propertyHubRespository, IFeatureRepository featureRepository, IMapper mapper)
        {
            _propertyHubRespository = propertyHubRespository;
            _featureRepository = featureRepository;
            _mapper = mapper;
        }

        // Get all Features
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeatureDto>>> GetFeaturesAsync()
        {
            var features = await _featureRepository.GetFeaturesAsync();

            var results = _mapper.Map<IEnumerable<FeatureDto>>(features);
            return Ok(results);
        }

        // Get properties with equal or larger walkScore
        [HttpGet("walkFeature/{walkScore}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByWalkScoreAsync(int walkScore)
        {
            var properties = await _featureRepository.GetPropertiesByWalkScoreAsync(walkScore);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties with equal or larger transitScore
        [HttpGet("transitFeature/{transitScore}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByTransitScoreAsync(int transitScore)
        {
            var properties = await _featureRepository.GetPropertiesByTransitScoreAsync(transitScore);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties with equal or larger bikeScore
        [HttpGet("bikeFeature/{bikeScore}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByBikeScoreAsync(int bikeScore)
        {
            var properties = await _featureRepository.GetPropertiesByBikeScoreAsync(bikeScore);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Get properties with equal or larger educationScore
        [HttpGet("educationFeature/{educationScore}")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByEducationScoreAsync(int educationScore)
        {
            var properties = await _featureRepository.GetPropertiesByEducationScoreAsync(educationScore);
            if (!properties.Any())
            {
                return NotFound();
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Add feature to the property 
        [HttpPost("{mls}/addFeature")]
        public async Task<IActionResult> AddFeatureToPropertyAsync(string mls, [FromBody] FeatureCreateDto featureCreateDto)
        {
            var feature = _mapper.Map<Feature>(featureCreateDto);

            var success = await _featureRepository.AddFeatureToPropertyAsync(mls, feature);

            if (!success)
            {
                return NotFound($"Property with ID {mls} not found.");
            }
            return Ok(new { Message = "Feature created successfully."});
        }

        // Update feature
        [HttpPut("{mls}/updateFeature")]
        public async Task<IActionResult> UpdateFeatureInPropertyAsync(string mls, [FromBody] FeatureUpdateDto featureUpdateDto)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            var updatedFeature = _mapper.Map<Feature>(featureUpdateDto);

            // Update the feature in the repository
            var success = await _featureRepository.UpdateFeatureInPropertyAsync(mls, updatedFeature);

            if (success)
            {
                return Ok(new { Message = "Feature updated successfully." });
            }
            else
            {
                return StatusCode(500, "An error occurred while updating the feature.");
            }
        }

        // Patch feature
        [HttpPatch("{mls}/patchFeature")]
        public async Task<IActionResult> PatchFeatureInPropertyAsync(string mls, [FromBody] JsonPatchDocument<FeatureUpdateDto> patchDocument)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            var featureToPatch = _mapper.Map<FeatureUpdateDto>(property.Feature);

            patchDocument.ApplyTo(featureToPatch, ModelState);

            if (!TryValidateModel(featureToPatch))
            {
                return ValidationProblem(ModelState);
            }

            var patchedFeature = _mapper.Map<Feature>(featureToPatch);

            // Update the feature in the repository
            var success = await _featureRepository.UpdateFeatureInPropertyAsync(mls, patchedFeature);

            if (success)
            {
                return Ok(new { Message = "Feature updated successfully." });
            }
            else
            {
                return StatusCode(500, "An error occurred while updating the feature.");
            }
        }

        // Delete feature in the property
        [HttpDelete("{mls}/deleteFeature")]
        public async Task<IActionResult> DeleteFeatureFromPropertyAsync(string mls)
        {
            var property = await _propertyHubRespository.GetPropertyByMLSAsync(mls);
            if (property == null)
            {
                return NotFound();
            }

            var success = await _featureRepository.DeleteFeatureFromPropertyAsync(mls);

            if (!success)
            {
                return NotFound($"Cannot delete feature from the property ID: {mls}.");
            }

            return Ok(new { Message = "Feature deleted from property successfully." });
        }
    }
}