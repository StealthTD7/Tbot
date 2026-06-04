# Tbot

Tbot is a Slack bot built with Node.js that brings useful commands directly into your Slack workspace.

## Features

### Utility Commands

* `/tbot-ping` — Check bot responsiveness and latency
* `/tbot-help` — Display available commands

### Fun Commands

* `/tbot-catfact` — Get a random cat fact
* `/tbot-joke` — Receive a random joke

### Cat Fact Command
<img width="633" height="95" alt="Capture" src="https://github.com/user-attachments/assets/e276c03b-6d66-4823-aa9b-eed7fc657e35" />

### Information Commands

* `/tbot-weather` — View the current weather

## Installation

### Clone the Repository

```bash
git clone https://github.com/StealthTD7/Tbot.git
cd Tbot
```
### Install Dependencies

```bash
npm install
```
### Create Environment Variables

Create a `.env` file in the project root:
```env
SLACK_BOT_TOKEN=your_bot_token
SLACK_APP_TOKEN=your_app_token
```

### Run the Bot
```bash
node index.js
```
If successful, you should see:
```text
bot is running!
```

## Available Commands

| Command         | Description                     |
| --------------- | ------------------------------- |
| `/tbot-ping`    | Check bot latency               |
| `/tbot-help`    | Show all available commands     |
| `/tbot-catfact` | Get a random cat fact           |
| `/tbot-joke`    | Get a random joke               |
| `/tbot-weather` | Get current weather information |
| `/tbot-todo`    | Add,see and edit a todo list    |

## Deployment

Tbot can be run continuously using systemd on Linux.
Restart the bot:
```bash
systemctl restart slackbot.service
```
View logs:
```bash
journalctl -u slackbot.service -f
```

Check service status:
```bash
systemctl status slackbot.service
```


