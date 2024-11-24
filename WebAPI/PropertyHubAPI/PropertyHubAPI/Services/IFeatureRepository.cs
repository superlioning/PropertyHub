using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public interface IFeatureRepository
    {
        Task<IEnumerable<Feature>> GetFeaturesAsync();
        Task<IEnumerable<Property>> GetPropertiesByWalkScoreAsync(int walkScore);
        Task<IEnumerable<Property>> GetPropertiesByTransitScoreAsync(int transitScore);
        Task<IEnumerable<Property>> GetPropertiesByBikeScoreAsync(int bikeScore);
        Task<IEnumerable<Property>> GetPropertiesByEducationScoreAsync(int educationScore);

        Task<bool> AddFeatureToPropertyAsync(string mls, Feature feature);
        Task<bool> UpdateFeatureInPropertyAsync(string mls, Feature updatedFeature);
        Task<bool> DeleteFeatureFromPropertyAsync(string mls);
    }
}