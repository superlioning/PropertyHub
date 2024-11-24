using AutoMapper;
using PropertyHubAPI.DTO.Addresses;
using PropertyHubAPI.DTO.Agencies;
using PropertyHubAPI.DTO.Features;
using PropertyHubAPI.DTO.Property;
using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Property
            CreateMap<Property, PropertyDto>();
            CreateMap<PropertyDto, Property>();
            CreateMap<Property, PropertyCreateDto>();
            CreateMap<PropertyCreateDto, Property>();
            CreateMap<Property, PropertyUpdateDto>();
            CreateMap<PropertyUpdateDto, Property>();
            CreateMap<Property, PropertyWithoutOthersAttributeDto>();
            CreateMap<PropertyWithoutOthersAttributeDto, Property>();

            // Address
            CreateMap<Address, AddressDto>();
            CreateMap<AddressDto, Address>();
            CreateMap<Address, AddressCreateDto>();
            CreateMap<AddressCreateDto, Address>();
            CreateMap<Address, AddressUpdateDto>();
            CreateMap<AddressUpdateDto, Address>();

            // Agent
            CreateMap<Agent, AgentDto>();
            CreateMap<AgentDto, Agent>();
            CreateMap<Agent, AgentCreateDto>();
            CreateMap<AgentCreateDto, Agent>();
            CreateMap<Agent, AgentUpdateDto>();
            CreateMap<AgentUpdateDto, Agent>();

            // Feature
            CreateMap<Feature, FeatureDto>();
            CreateMap<FeatureDto, Feature>();
            CreateMap<Feature, FeatureCreateDto>();
            CreateMap<FeatureCreateDto, Feature>();
            CreateMap<Feature, FeatureUpdateDto>();
            CreateMap<FeatureUpdateDto, Feature>();
        }
    }
}