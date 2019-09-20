using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QueueController : ControllerBase
    {
        private readonly Queue queue;

        public QueueController(Queue queue)
        {
            this.queue = queue;
        }

        // GET: api/Project
        [HttpGet]
        public async Task<IEnumerable<Project>> Get()
        {
            return await queue.ReadQueueAsync();
        }

        // POST: api/Project
        [HttpPost]
        public async Task Post([FromBody] Project value)
        {
            await queue.PushAsync(value);
        }

        // PUT: api/Project/5
        [HttpPut("{id}")]
        public async Task Put(string id, [FromBody] Project value)
        {
            await queue.RemoveAsync(new ProjectId(id));
            await queue.PushAsync(value);
        }

        // DELETE: api/Project/5
        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
            await queue.RemoveAsync(new ProjectId(id));
        }
    }
}