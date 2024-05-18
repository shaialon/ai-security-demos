# AI Agent

AI Agent is a server application leveraging OpenAI's API to perform intelligent search "data scientist" operations.

It's Designed with Node.js, and allows users to query structured information in natural language

## Features

- Interactive `fastify` server for creating Booking.com urls, based on the users' natural language input.
- Stylish terminal output with `chalk` and clickable links with `terminal-link`.
- Persistent local storage for caching results and queries with `node-persist`.

## Prerequisites

- Node.js version >= 20.10.0
- You can set up [Node Version Manager](https://github.com/nvm-sh/nvm) for it.

## Installation

### Clone the repository

```bash
git clone https://github.com/shaialon/ai-search.git
cd ai-search
```

### install the dependencies:

run `nvm use` to have it choose the correct node version. run `npm install` to install the various dependencies.

### Configuration

Create a `.env` file in the root directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

## Usage

To start the application server, run:

```bash
npm start
```

You can then make requests like so (via POSTMAN or just a browser):

```
GET http://localhost:8010/ai_search?search={{url_encoded_query_here}}
```

### To run tests:

```bash
npm test
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
