using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public interface IFeatureRepository
    {
        Task<IEnumerable<Feature>> GetFeaturesAsync();
        Task<IEnumerable<Feature>> GetFeaturesByWalkScoreAsync(int walkScore);
        Task<IEnumerable<Feature>> GetFeaturesByTransitScoreAsync(int transitScore);
        Task<IEnumerable<Feature>> GetFeaturesByBikeScoreAsync(int bikeScore);
        Task<IEnumerable<Feature>> GetFeaturesByEducationScoreAsync(int educationScore);

        Task<bool> AddFeatureToPropertyAsync(string mls, Feature feature);
        Task<bool> UpdateFeatureAsync(string mls, Feature updatedFeature);
        Task<bool> DeleteFeatureFromPropertyAsync(string mls);
    }
}