using PropertyHubAPI.DTO.Addresses;

namespace PropertyHubAPI.DTO.Agencies
{
    public class AgentCreateDto
    {
        public required string RegistrationNumber { get; set; }
        public required string Name { get; set; }
        public required string RegistrationCategory { get; set; }
        public required string BrokerageTradeName { get; set; }
        public required string BrokeragePhone { get; set; }
        public required string BrokerageEmail { get; set; }
        public required AddressDto BrokerageAddress { get; set; }
    }
}