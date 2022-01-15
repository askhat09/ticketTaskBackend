const data = require("./tickets.json");
const { nanoid } = require("nanoid");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomizer = (bottom, top) => {
  return () => {
    return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
  };
};

const searchDelay = getRandomizer(100, 200);

const ticketDelay = getRandomizer(60, 160);

const cursors = new Map();

const search = async () => {
  const delay = searchDelay();

  await sleep(delay);

  if (cursors.size > 40) {
    cursors.clear();
  }

  const randomCursor = nanoid(11);

  cursors.set(randomCursor, 0);

  return randomCursor;
};

const tickets = async (cursor) => {
  const hasCursor = cursors.has(cursor);

  if (!hasCursor) {
    throw new Error("cursor not found");
  }

  const delay = ticketDelay();

  await sleep(delay);

  const amount = 20;

  const currentPosition = cursors.get(cursor);

  const tickets = data.tickets.slice(currentPosition, currentPosition + amount);

  if (currentPosition > 220) {
    return {
      stop: true,
      tickets,
    };
  }

  cursors.set(cursor, currentPosition + amount);

  return {
    stop: false,
    tickets,
  };
};

module.exports = {
  search,
  tickets,
};
