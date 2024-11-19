using Amazon.DynamoDBv2.DataModel;

namespace PropertyHubLibrary.Models
{
    [DynamoDBTable("Agent")]
    public class Agent
    {
        // Partition Key, RECO registration number
        [DynamoDBHashKey] 
        public required string RegistrationNumber { get; set; }

        // Mandatory fields for agent registration
        public required string Name { get; set; }
        public required string RegistrationCategory { get; set; }
        public required string BrokerageTradeName { get; set; }
        public required string BrokeragePhone { get; set; }
        public required string BrokerageEmail { get; set; }
        public required Address BrokerageAddress { get; set; }
    }
}