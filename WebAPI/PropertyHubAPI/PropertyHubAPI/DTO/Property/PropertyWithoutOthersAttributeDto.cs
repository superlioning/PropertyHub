using PropertyHubAPI.DTO.Addresses;

namespace PropertyHubAPI.DTO.Property
{
    public class PropertyWithoutOthersAttributeDto
    {
        public required string MLS { get; set; }
        public required string Type { get; set; }
        public required decimal Price { get; set; }
        public required int Bedrooms { get; set; }
        public required int Bathrooms { get; set; }
        public required int Parkings { get; set; }
        public required int Size { get; set; }
        public required int YearBuilt { get; set; }
        public required decimal Tax { get; set; }
        public required AddressDto Address { get; set; }
        public required string Status { get; set; }
        public required string Description { get; set; }
    }
}