#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonListResponse {
  results: Pokemon[];
}

const isValidPokemonArgs = (args: any): args is { name: string } =>
  typeof args === 'object' && args !== null && typeof args.name === 'string';

class PokeAPIServer {
  private server: Server;
  private axiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: 'pokeapi-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: API_URL,
    });

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_pokemon',
          description: 'Get information about a specific Pokémon.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the Pokémon.',
              },
            },
            required: ['name'],
          },
        },
        {
          name: 'list_pokemon',
          description: 'List multiple Pokémon using a limit and optional offset.',
          inputSchema: {
            type: 'object',
            properties: {
              limit: {
                type: 'string',
                description: 'The maximum number of Pokémon to retrieve.',
              },
              offset: {
                type: 'string',
                description: 'The number of Pokémon to skip before starting to collect the result set.',
              },
            },
            required: ['limit'], // 'offset' is optional
          },
        },
      ],
    }));
    
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'get_pokemon') {
        if (!isValidPokemonArgs(request.params.arguments)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Invalid pokemon arguments'
          );
        }
    
        const pokemonName = request.params.arguments.name.toLowerCase();
    
        try {
          const response = await this.axiosInstance.get(`/pokemon/${pokemonName}`);
    
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return {
              content: [
                {
                  type: 'text',
                  text: `PokeAPI error: ${
                    error.response?.data.message ?? error.message
                  }`,
                },
              ],
              isError: true,
            };
          }
          throw error;
        }
      } else if (request.params.name === 'list_pokemon') {
        const limit = request.params.arguments?.limit || '5';
        const offset = request.params.arguments?.offset;
    
        const queryParams = new URLSearchParams({ limit: String(limit) });
        if (offset) {
          queryParams.append('offset', String(offset));
        }

    
        try {
          const response = await this.axiosInstance.get(`/pokemon?${queryParams.toString()}`);
    
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return {
              content: [
                {
                  type: 'text',
                  text: `PokeAPI error: ${
                    error.response?.data.message ?? error.message
                  }`,
                },
              ],
              isError: true,
            };
          }
          throw error;
        }
      } else {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('PokeAPI MCP server running on stdio');
  }
}

const server = new PokeAPIServer();
server.run().catch(console.error);
