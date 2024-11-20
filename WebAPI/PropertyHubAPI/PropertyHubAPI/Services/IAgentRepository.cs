using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public interface IAgentRepository
    {
        Task<IEnumerable<Agent>> GetAgentsAsync();
        Task<Agent> GetAgentByIdAsync(string registrationNumber);
        Task<IEnumerable<Property>> GetPropertiesByAgentAsync(string registrationNumber);

        Task<Agent> AddAgentAsync(Agent agent);
        Task<bool> UpdateAgentAsync(Agent updatedAgent);
        Task<bool> DeleteAgentAsync(string registrationNumber);
    }
}