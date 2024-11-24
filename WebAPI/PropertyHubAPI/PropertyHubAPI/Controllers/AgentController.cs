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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var agent = _mapper.Map<Agent>(agentCreateDto);

            var success = await _agentRepository.AddAgentAsync(agent);

            if (!success)
            {
                return StatusCode(500, "An error occurred while adding the agent.");
            }

            return CreatedAtAction(nameof(GetAgentByRegistrationNumberAsync), new { registrationNumber = agent.RegistrationNumber }, agent);
        }

        // Update agent
        [HttpPut("{registrationNumber}")]
        public async Task<IActionResult> UpdateAgentAsync(string registrationNumber, [FromBody] AgentUpdateDto agentUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var agent = await _agentRepository.GetAgentByRegistrationNumberAsync(registrationNumber);
            if (agent == null)
            {
                return NotFound($"Agent with Registration Number {registrationNumber} not found.");
            }

            _mapper.Map(agentUpdateDto, agent);

            var success = await _agentRepository.UpdateAgentAsync(agent);

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
            if (patchDocument == null)
            {
                return BadRequest("Patch document cannot be null.");
            }

            var agent = await _agentRepository.GetAgentByRegistrationNumberAsync(registrationNumber);
            if (agent == null)
            {
                return NotFound($"Agent with Registration Number {registrationNumber} not found.");
            }

            var agentToPatch = _mapper.Map<AgentUpdateDto>(agent);

            patchDocument.ApplyTo(agentToPatch, ModelState);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _mapper.Map(agentToPatch, agent);

            var success = await _agentRepository.UpdateAgentAsync(agent);

            if (!success)
            {
                return StatusCode(500, "An error occurred while patching the agent.");
            }

            return Ok(new { Message = "Agent patched successfully.", UpdatedAgent = agent });
        }

        // Delete agent
        [HttpDelete("{registrationNumber}")]
        public async Task<IActionResult> DeleteAgentAsync(string registrationNumber)
        {
            var success = await _agentRepository.DeleteAgentAsync(registrationNumber);

            if (!success)
            {
                return NotFound($"Agent with Registration Number {registrationNumber} not found.");
            }

            return Ok(new { Message = "Agent deleted successfully." });
        }
    }
}