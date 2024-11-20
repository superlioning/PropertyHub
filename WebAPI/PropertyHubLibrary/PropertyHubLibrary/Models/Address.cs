namespace PropertyHubLibrary.Models
{
    public class Address
    {
        public required string StreetNumber { get; set; }
        public required string StreetName { get; set; }

        public string? Unit { get; set; }
        public required string City { get; set; }
        public required string Province { get; set; }
        public required string PostalCode { get; set; }
        public required string Country { get; set; }
    }
}