using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using PropertyHubAPI.DTO.Features;
using PropertyHubAPI.DTO.Property;
using PropertyHubAPI.Services;

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
        public async Task<ActionResult<IEnumerable<FeatureDto>>> GetAllFeatures()
        {
            var features = await _featureRepository.GetFeaturesAsync();
            var results = _mapper.Map<IEnumerable<FeatureDto>>(features);
            return Ok(results);
        }

        // Get Features by WalkScore
        [HttpGet("walkScore/{walkScore}")]
        public async Task<ActionResult<IEnumerable<FeatureDto>>> GetFeaturesByWalkScore(int walkScore)
        {
            var features = await _featureRepository.GetFeaturesByWalkScoreAsync(walkScore);
            if (features == null)
            {
                return NotFound();
            }
            var results = _mapper.Map<IEnumerable<FeatureDto>>(features);
            return Ok(results);
        }

        // Get Features by TransitScore
        [HttpGet("transitScore/{transitScore}")]
        public async Task<ActionResult<IEnumerable<FeatureDto>>> GetFeaturesByTransitScore(int transitScore)
        {
            var features = await _featureRepository.GetFeaturesByTransitScoreAsync(transitScore);
            if (features == null)
            {
                return NotFound();
            }
            var results = _mapper.Map<IEnumerable<FeatureDto>>(features);
            return Ok(results);
        }

        // Get Features by BikeScore
        [HttpGet("bikeScore/{bikeScore}")]
        public async Task<ActionResult<IEnumerable<FeatureDto>>> GetFeaturesByBikeScore(int bikeScore)
        {
            var features = await _featureRepository.GetFeaturesByBikeScoreAsync(bikeScore);
            if (features == null)
            {
                return NotFound();
            }
            var results = _mapper.Map<IEnumerable<FeatureDto>>(features);
            return Ok(results);
        }

        // Get Features by EducationScore
        [HttpGet("educationScore/{educationScore}")]
        public async Task<ActionResult<IEnumerable<FeatureDto>>> GetFeaturesByEducationScore(int educationScore)
        {
            var features = await _featureRepository.GetFeaturesByEducationScoreAsync(educationScore);
            if (features == null)
            {
                return NotFound();
            }
            var results = _mapper.Map<IEnumerable<FeatureDto>>(features);
            return Ok(results);
        }

        // Add feature to the Property
        [HttpPost("{MLS}/feature")]
        public async Task<IActionResult> AddFeatureToProperty(string MLS, [FromBody] FeatureDto featureDto)
        {
            var success = await _featureRepository.AddFeatureToPropertyAsync(MLS, featureDto);

            if (!success)
            {
                return NotFound($"Property with MLS {MLS} not found.");
            }
            return Ok(new { Message = "Feature created successfully.", FeatureDto = featureDto });
        }

        // Update feature
        [HttpPut("{MLS}/updateFeature")]
        public async Task<IActionResult> UpdateFeature(string MLS, [FromBody] FeatureDto featureDto)
        {
            var property = await _propertyHubRespository.GetPropertyByIdAsync(MLS);
            if (property == null)
            {
                return NotFound();
            }

            var updateResult = await _featureRepository.UpdateFeature(MLS, featureDto);

            if (updateResult)
                return Ok("Feature updated successfully.");
            else
                return StatusCode(500, "An error occurred while updating the feature.");
        }

        // Patch feature
        [HttpPatch("{MLS}/updateFeature")]
        public async Task<IActionResult> UpdateFeaturePatch(string MLS, [FromBody] JsonPatchDocument<FeatureDto> patchDoc)
        {
            var property = await _propertyHubRespository.GetPropertyByIdAsync(MLS);
            if (property == null)
            {
                return NotFound();
            }

            var propertyDto = _mapper.Map<PropertyDto>(property);
            if (propertyDto.Feature == null)
            {
                return BadRequest("No feature available to update.");
            }

            var featureToUpdate = _mapper.Map<FeatureDto>(propertyDto.Feature);
            patchDoc.ApplyTo(featureToUpdate, ModelState);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updateResult = await _featureRepository.UpdateFeature(MLS, featureToUpdate);

            if (updateResult)
                return Ok(new { Message = "Feature updated successfully." });
            else
                return StatusCode(500, "An error occurred while updating the feature.");
        }

        // Delete feature from the Property
        [HttpDelete("{MLS}/deleteFeature")]
        public async Task<IActionResult> DeleteFeatureFromProperty(string MLS)
        {
            var property = await _propertyHubRespository.GetPropertyByIdAsync(MLS);
            if (property == null)
            {
                return NotFound();
            }

            var success = await _featureRepository.DeleteFeatureFromPropertyAsync(MLS);

            if (!success)
            {
                return NotFound($"Cannot delete feature from the Property with MLS: {MLS}.");
            }

            return Ok(new { Message = "Feature deleted from Property successfully." });
        }
    }
}