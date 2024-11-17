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
            CreateMap<Property, PropertyCreateionDto>();
            CreateMap<PropertyCreateionDto, Property>();
            CreateMap<Property, PropertyWithoutOthersAttributeDto>();
            CreateMap<Property, PropertyUpdateDto>();
            CreateMap<PropertyUpdateDto, Property>();
            CreateMap<Property, PropertyDto>();

            //Address
            CreateMap<Address, AddressDto>();
            CreateMap<AddressDto, Address>();

            //Agent
            CreateMap<Agent, AgentDto>();
            CreateMap<AgentDto, Agent>();
            CreateMap<Agent, AgentCreationDto>();
            CreateMap<Agent, AgentUpdateDto>();
            CreateMap<AgentUpdateDto, Agent>();

            //Feature
            CreateMap<Feature, FeatureDto>();
            CreateMap<FeatureDto, Feature>();
        }
    }
}