require("dotenv").config();
const axios = require("axios");
const { App } = require("@slack/bolt");
const fs = require("fs");
const TODO_FILE = "./todos.json";

function loadTodos() {
  if (!fs.existsSync(TODO_FILE)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(TODO_FILE, "utf8"));
}

function saveTodos(todos) {
  fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2));
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/tbot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/tbot-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/tbot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/tbot-weather", async ({ command, ack, respond }) => {

  await ack();

  try {
    const response = await axios.get("https://wttr.in/?format=3");
    await respond({
      text: response.data,
    });
  } catch (error) {
    await respond({
      text: "Unable to fetch weather information right now.",
    });
  }
});

app.command("/tbot-todo", async ({ command, ack, respond }) => {
  await ack();

  const todos = loadTodos();

  const userId = command.user_id;

  if (!todos[userId]) {
    todos[userId] = [];
  }

  const [action, ...args] = command.text.split(" ");

  switch (action) {
    case "add": {
      const task = args.join(" ").trim();

      if (!task) {
        return respond({
          text: "Usage: /tbot-todo add <task>"
        });
      }

      todos[userId].push(task);
      saveTodos(todos);

      return respond({
        text: `Added: ${task}`
      });
    }

    case "list": {
      if (todos[userId].length === 0) {
        return respond({
          text: "You have no todos."
        });
      }

      return respond({
        text: todos[userId]
          .map((todo, index) => `${index + 1}. ${todo}`)
          .join("\n")
      });
    }

    case "remove": {
      const index = parseInt(args[0], 10) - 1;

      if (
        isNaN(index) ||
        index < 0 ||
        index >= todos[userId].length
      ) {
        return respond({
          text: "Invalid todo number."
        });
      }

      const removed = todos[userId].splice(index, 1)[0];

      saveTodos(todos);

      return respond({
        text: `Removed: ${removed}`
      });
    }

    case "clear": {
      todos[userId] = [];
      saveTodos(todos);

      return respond({
        text: "Todo list cleared."
      });
    }

    default:
      return respond({
        text:
`Todo Commands:
/tbot-todo add <task>
/tbot-todo list
/tbot-todo remove <number>
/tbot-todo clear`
      });
  }
});

app.command("/tbot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/tbot-ping - Check bot latency
/tbot-catfact - Get a cat fact
/tbot-joke - Get a joke
/tbot-weather - Get weather
/tbot-todo - Manage todos`
  });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

