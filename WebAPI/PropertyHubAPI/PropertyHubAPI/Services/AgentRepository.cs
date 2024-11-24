using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using PropertyHubLibrary.Connector;
using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Services
{
    public class AgentRepository : IAgentRepository
    {
        private readonly AWSConnector _awsConnector;
        private readonly string _tableName = "Agent";
        private readonly Table _table;

        public AgentRepository(AWSConnector awsConnector)
        {
            _awsConnector = awsConnector;
            _table = _awsConnector.LoadContentTable(_tableName);
        }

        public async Task<IEnumerable<Agent>> GetAgentsAsync()
        {
            DynamoDBContext context = _awsConnector.Context;

            var agents = await context.ScanAsync<Agent>(new List<ScanCondition>()).GetRemainingAsync();
            return agents;
        }

        public async Task<Agent> GetAgentByRegistrationNumberAsync(string registrationNumber)
        {
            DynamoDBContext context = _awsConnector.Context;

            var agent = await context.LoadAsync<Agent>(registrationNumber);
            return agent;
        }

        public async Task<IEnumerable<Property>> GetPropertiesByAgentAsync(string registrationNumber)
        {
            DynamoDBContext context = _awsConnector.Context;

            var conditions = new List<ScanCondition>
            {
                new ScanCondition("AgentRegistrationNumber", ScanOperator.Equal, registrationNumber)
            };

            var properties = await context.ScanAsync<Property>(conditions).GetRemainingAsync();
            return properties;
        }

        public async Task<bool> AddAgentAsync(Agent agent)
        {
            DynamoDBContext context = _awsConnector.Context;

            try
            {
                await context.SaveAsync(agent);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding agent: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> UpdateAgentAsync(Agent updatedAgent)
        {
            DynamoDBContext context = _awsConnector.Context;

            try
            {
                var existingAgent = await context.LoadAsync<Agent>(updatedAgent.RegistrationNumber);
                if (existingAgent == null)
                {
                    return false;
                }

                await context.SaveAsync(updatedAgent);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating agent: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteAgentAsync(string registrationNumber)
        {
            DynamoDBContext context = _awsConnector.Context;

            try
            {
                var agent = await context.LoadAsync<Agent>(registrationNumber);
                if (agent == null)
                {
                    return false;
                }

                await context.DeleteAsync(agent);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting agent: {ex.Message}");
                return false;
            }
        }
    }
}