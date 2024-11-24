namespace PropertyHubAPI.Services
{
    public interface IFileStorageService
    {
        Task<IEnumerable<string>> AddImagesToPropertyAsync(IEnumerable<IFormFile> imageUrls);
        Task<String> AddOneImageToPropertyAsync(IFormFile imageUrl);
        Task DeleteOneImageFromPropertyAsync(string imageUrl);
    }
}