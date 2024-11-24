namespace PropertyHubAPI.DTO.Features
{
    public class FeatureUpdateDto
    {
        public int? WalkScore { get; set; }
        public int? TransitScore { get; set; }
        public int? BikeScore { get; set; }
        public int? EducationScore { get; set; }
    }
}