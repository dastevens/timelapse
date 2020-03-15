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

        // GET: api/queue
        [HttpGet]
        public async Task<IEnumerable<Project>> Get()
        {
            return await queue.ReadQueueAsync();
        }

        // POST: api/queue
        [HttpPost]
        public async Task Post([FromBody] Project value)
        {
            await queue.PushAsync(value);
        }

        // PUT: api/queue/5
        [HttpPut("{id}")]
        public async Task Put(string id, [FromBody] Project value)
        {
            await queue.RemoveAsync(new ProjectId(id));
            await queue.PushAsync(value);
        }

        // DELETE: api/queue/5
        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
            await queue.RemoveAsync(new ProjectId(id));
        }
    }
}