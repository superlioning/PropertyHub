using PropertyHubAPI.DTO.Addresses;
using PropertyHubAPI.DTO.Features;

namespace PropertyHubAPI.DTO.Property
{
    public class PropertyUpdateDto
    {
        public string? Type { get; set; }
        public decimal? Price { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public int? Parkings { get; set; }
        public int? Size { get; set; }
        public int? YearBuilt { get; set; }
        public decimal? Tax { get; set; }
        public AddressDto? Address { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }
        public string? AgentName { get; set; }
        public List<string>? ImageUrls { get; set; }
        public FeatureDto? Feature { get; set; }
        public required DateTime LastUpdate { get; set; }
    }
}