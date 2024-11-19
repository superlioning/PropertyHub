namespace PropertyHubAPI.DTO.Addresses
{
    public class AddressDto
    {
        public required string StreetNumber { get; set; }
        public required string StreetName { get; set; }
        public required string City { get; set; }
        public required string Province { get; set; }
        public required string PostalCode { get; set; }
        public required string Country { get; set; }
    }
}