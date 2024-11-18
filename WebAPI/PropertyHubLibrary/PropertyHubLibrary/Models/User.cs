using Amazon.DynamoDBv2.DataModel;

namespace PropertyHubLibrary.Models
{
    [DynamoDBTable("User")]
    public class User
    {
        [DynamoDBHashKey] // Partition Key, login ID
        public required string Email { get; set; }

        // Mandatory fields in regular user profile
        [DynamoDBProperty("Password")]
        public required string Password { get; set; }

        [DynamoDBProperty("Role")]
        public required string Role { get; set; }

        [DynamoDBProperty("Name")]
        public required string Name { get; set; }

        // Optional fields
        [DynamoDBProperty("Phone")]
        public string? Phone { get; set; }

        [DynamoDBProperty("Address")]
        public Address? Address { get; set; }
    }
}