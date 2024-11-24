using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public interface IAgentRepository
    {
        Task<IEnumerable<Agent>> GetAgentsAsync();
        Task<Agent> GetAgentByRegistrationNumberAsync(string registrationNumber);
        Task<IEnumerable<Property>> GetPropertiesByAgentAsync(string registrationNumber);

        Task<bool> AddAgentAsync(Agent agent);
        Task<bool> UpdateAgentAsync(Agent updatedAgent);
        Task<bool> DeleteAgentAsync(string registrationNumber);
    }
}