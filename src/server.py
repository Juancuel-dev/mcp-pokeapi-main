from mcp.server.fastmcp import FastMCP
import httpx
import os

mcp = FastMCP("pokeapi")

API_END_POINT = "https://pokeapi.co/api/v2/pokemon"

@mcp.tool()
async def get_pokemon():
    POKEMON_NAME = os.environ.get("POKEMON_NAME")
    LIMIT = os.environ.get("LIMIT")

    if( not POKEMON_NAME ):
        POKEMON_NAME = ""
        
    if( not LIMIT ):
        LIMIT = ""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                API_END_POINT+"/" + POKEMON_NAME,
                headers={
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                },
        )
    else:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                API_END_POINT+"?limit=" + LIMIT,
                headers={
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                },
        )
        
    response.raise_for_status()

    return response.text

if __name__ == "__main__":
    mcp.run()