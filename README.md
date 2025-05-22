
# PokeAPI MCP Server

-   This is an open-source [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that connects to the PokeAPI to deliver up-to-date Pokémon information via natural language interactions.

-   Designed for use with MCP-enabled clients such as Claude Desktop, it allows users to retrieve Pokémon data by leveraging large language models (LLMs).

## 🚀 Quick Start

### Prerequisites

-   Node.js
-   npm
-   MCP-compatible client (e.g., Claude for Desktop)

---

## 🛠️ Tools

The following tools are exposed to MCP clients:

### `get_pokemon(name: string)`

-> Returns information about a specific Pokémon.

### `list_pokemon(limit: string)`

-> Returns a list of Pokémon with a specified limit.

---

## 📝 License

-   This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details.
-   Built with [Model Context Protocol](https://modelcontextprotocol.io/introduction)

## Installation Instructions

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd pokeapi-server
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the root directory and add any necessary environment variables:

    ```
    # Environment variables for the MCP consumer API
    # API_URL=your_api_url
    ```

4.  **Build the project:**

    ```bash
    npm run build
    ```

## Usage

To use the PokeAPI MCP server, you need to:

1.  Add the server to your MCP client.
2.  Enable the server in your MCP client.
3.  Use the `get_pokemon` or `list_pokemon` tool with the appropriate arguments.

For example, to get information about Pikachu, you can use the following command:

```
get_pokemon(name: "pikachu")
```

To list the first 5 Pokémon, you can use the following command:

```
list_pokemon(limit: "5")
```
