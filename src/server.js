const fastify = require("fastify")({ logger: false });
const api = require("./tickets/index");

fastify.get("/search", async (req, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "GET");

  try {
    const searchId = await api.search();

    reply.send({
      searchId,
    });
  } catch (error) {
    reply.code(500).send("Server error");
  }
});

fastify.get("/tickets", async (req, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "GET");

  const searchId = req?.query?.searchId;

  if (!searchId) {
    reply.code(400).send("Invalid searchId");
  }

  const getRandomNumber = (top, bottom) => {
    return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
  };

  const randomNumber = getRandomNumber(0, 100);

  if (randomNumber > 93) {
    reply.code(500).send("Server error");
  }

  try {
    const tickets = await api.tickets(searchId);

    return tickets;
  } catch (error) {
    reply.code(404).send(`Search with id ${searchId} is not found`);
  }
});

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 1234);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
