using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using PropertyHubAPI.DTO.Agencies;
using PropertyHubAPI.DTO.Property;
using PropertyHubAPI.Services;
using PropertyHubLibrary.Models;

namespace PropertyHubAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentController : ControllerBase
    {
        private readonly IPropertyHubRespository _propertyHubRespository;
        private readonly IAgentRepository _agentRepository;
        private readonly IMapper _mapper;

        public AgentController(IPropertyHubRespository propertyHubRespository, IAgentRepository agentRepository, IMapper mapper)
        {
            _propertyHubRespository = propertyHubRespository;
            _agentRepository = agentRepository;
            _mapper = mapper;
        }

        // Get all agents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AgentDto>>> GetAgentsAsync()
        {
            var agents = await _agentRepository.GetAgentsAsync();
            if (!agents.Any())
            {
                return NotFound("No agents found.");
            }

            var results = _mapper.Map<IEnumerable<AgentDto>>(agents);
            return Ok(results);
        }

        // Get agent by registration number
        [HttpGet("{registrationNumber}")]
        public async Task<ActionResult<AgentDto>> GetAgentByRegistrationNumberAsync(string registrationNumber)
        {
            var agent = await _agentRepository.GetAgentByRegistrationNumberAsync(registrationNumber);
            if (agent == null)
            {
                return NotFound($"Agent with Registration Number {registrationNumber} not found.");
            }

            var result = _mapper.Map<AgentDto>(agent);
            return Ok(result);
        }

        // Get properties by agent
        [HttpGet("{registrationNumber}/properties")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetPropertiesByAgentAsync(string registrationNumber)
        {
            var properties = await _agentRepository.GetPropertiesByAgentAsync(registrationNumber);

            if (!properties.Any())
            {
                return NotFound($"No properties found for Agent {registrationNumber}.");
            }

            var results = _mapper.Map<IEnumerable<PropertyDto>>(properties);
            return Ok(results);
        }

        // Add agent
        [HttpPost]
        public async Task<IActionResult> AddAgentAsync([FromBody] AgentCreateDto agentCreateDto)
        {
            var agent = _mapper.Map<Agent>(agentCreateDto);

            var success = await _agentRepository.AddAgentAsync(agent);

            if (!success)
            {
                return StatusCode(500, "An error occurred while adding the agent.");
            }

            return Ok(new { Message = "Agent added successfully." });
        }

        // Update agent
        [HttpPut("{registrationNumber}")]
        public async Task<IActionResult> UpdateAgentAsync(string registrationNumber, [FromBody] AgentUpdateDto agentUpdateDto)
        {
            var agent = await _agentRepository.GetAgentByRegistrationNumberAsync(registrationNumber);
            if (agent == null)
            {
                return NotFound();
            }

            var updatedAgent = _mapper.Map<Agent>(agentUpdateDto);
            updatedAgent.RegistrationNumber = registrationNumber;

            var success = await _agentRepository.UpdateAgentAsync(updatedAgent);

            if (!success)
            {
                return StatusCode(500, "An error occurred while updating the agent.");
            }

            return Ok(new { Message = "Agent updated successfully." });
        }

        // Patch agent
        [HttpPatch("{registrationNumber}")]
        public async Task<IActionResult> PatchAgentAsync(string registrationNumber, [FromBody] JsonPatchDocument<AgentUpdateDto> patchDocument)
        {
            var agent = await _agentRepository.GetAgentByRegistrationNumberAsync(registrationNumber);
            if (agent == null)
            {
                return NotFound();
            }

            var agentToPatch = _mapper.Map<AgentUpdateDto>(agent);

            patchDocument.ApplyTo(agentToPatch, ModelState);

            if (!TryValidateModel(agentToPatch))
            {
                return ValidationProblem(ModelState);
            }

            var patchedAgent = _mapper.Map<Agent>(agentToPatch);
            patchedAgent.RegistrationNumber = registrationNumber;
            var success = await _agentRepository.UpdateAgentAsync(patchedAgent);

            if (success)
            {
                return Ok(new { Message = "Agent updated successfully." });
            }
            else
            {
                return StatusCode(500, "An error occurred while updating the agent.");
            }
        }

        // Delete agent
        [HttpDelete("{registrationNumber}")]
        public async Task<IActionResult> DeleteAgentAsync(string registrationNumber)
        {
            var success = await _agentRepository.DeleteAgentAsync(registrationNumber);

            if (!success)
            {
                return NotFound();
            }

            return Ok(new { Message = "Agent deleted successfully." });
        }
    }
}