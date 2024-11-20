namespace PropertyHubAPI.DTO.Addresses
{
    public class AddressUpdateDto
    {
        public string? StreetNumber { get; set; }
        public string? StreetName { get; set; }
        public string? Unit { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
    }
}