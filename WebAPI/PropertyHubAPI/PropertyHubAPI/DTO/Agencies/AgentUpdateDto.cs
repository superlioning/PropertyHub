using PropertyHubAPI.DTO.Addresses;

namespace PropertyHubAPI.DTO.Agencies
{
    public class AgentUpdateDto
    {
        public string? Name { get; set; }
        public string? RegistrationCategory { get; set; }
        public string? BrokerageTradeName { get; set; }
        public string? BrokeragePhone { get; set; }
        public string? BrokerageEmail { get; set; }
        public AddressDto? BrokerageAddress { get; set; }
    }
}