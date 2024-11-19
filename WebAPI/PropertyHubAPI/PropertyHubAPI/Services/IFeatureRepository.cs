using PropertyHubAPI.DTO.Features;

namespace PropertyHubAPI.Services
{
    public interface IFeatureRepository
    {
        Task<IEnumerable<FeatureDto>> GetFeaturesAsync();
        Task<IEnumerable<FeatureDto>> GetFeaturesByWalkScoreAsync(int walkScore);
        Task<IEnumerable<FeatureDto>> GetFeaturesByTransitScoreAsync(int transitScore);
        Task<IEnumerable<FeatureDto>> GetFeaturesByBikeScoreAsync(int bikeScore);
        Task<IEnumerable<FeatureDto>> GetFeaturesByEducationScoreAsync(int educationScore);
        Task<bool> AddFeatureToPropertyAsync(string MLS, FeatureDto featureDto);
        Task<bool> UpdateFeature(string MLS, FeatureDto updatedFeature);
        Task<bool> DeleteFeatureFromPropertyAsync(string MLS);
    }
}