using PropertyHubAPI.DTO.Agencies;
using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public interface IAgentRepository
    {
        Task<IEnumerable<Agent>> GetAgentsAsync();
        Task<Agent> GetAgentByIdAsync(string agentId);
        Task<bool> AddAgentToPropertyAsync(string propertyId, AgentCreationDto agentDto);
        Task<bool> UpdateAgent(string propertyId, Agent agent);
        Task<bool> DeleteAgentFromPropertyAsync(string propertyId, string agentId);
    }
}