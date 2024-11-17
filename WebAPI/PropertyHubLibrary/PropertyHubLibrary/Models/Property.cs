using Amazon.DynamoDBv2.DataModel;

namespace PropertyHubLibrary.Models
{
    [DynamoDBTable("Property")]
    public class Property
    {
        [DynamoDBHashKey] // Partition Key
        public string? PropertyId { get; set; }

        [DynamoDBProperty("PropertyName")]
        public string? PropertyName { get; set; }

        [DynamoDBProperty("PropertyDesc")]
        public string? PropertyDesc { get; set; }

        [DynamoDBProperty("PropertyTax")]
        public decimal PropertyTax { get; set; }

        [DynamoDBProperty("LastUpdate")]
        public string? LastUpdate { get; set; }

        [DynamoDBProperty("DateListed")]
        public string? DateListed { get; set; }

        [DynamoDBProperty("Price")]
        public decimal Price { get; set; }

        [DynamoDBProperty("Status")]
        public string? Status { get; set; }

        [DynamoDBProperty("PropertyType")]
        public string? PropertyType { get; set; }

        [DynamoDBProperty("PropertyImageUrls")]
        public List<string>? PropertyImageUrls { get; set; }

        [DynamoDBProperty("Address")]
        public Address? PropertyAddresses { get; set; }

        [DynamoDBProperty("Agent")]
        public Agent? Agents { get; set; }

        [DynamoDBProperty("Feature")]
        public Feature? Features { get; set; }

    }
}