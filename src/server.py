from mcp.server.fastmcp import FastMCP
import httpx
import os

mcp = FastMCP("pokeapi")

API_END_POINT = "https://pokeapi.co/api/v2/pokemon"

@mcp.tool()
async def get_pokemon():
    POKEMON_NAME = os.environ.get("POKEMON_NAME")
    LIMIT = os.environ.get("LIMIT")
    OFFSET = os.environ.get("OFFSET")  # Nuevo parámetro opcional

    if not POKEMON_NAME:
        POKEMON_NAME = ""
    
    if not LIMIT:
        LIMIT = ""

    if POKEMON_NAME:
        # Si se especifica el nombre del Pokémon, se ignoran LIMIT y OFFSET
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{API_END_POINT}/{POKEMON_NAME}",
                headers={
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                },
            )
    else:
        # Construir la query con LIMIT y OFFSET
        query_params = []
        if LIMIT:
            query_params.append(f"limit={LIMIT}")
        if OFFSET:
            query_params.append(f"offset={OFFSET}")
        
        query_string = "&".join(query_params)

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{API_END_POINT}?{query_string}",
                headers={
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                },
            )
        
    response.raise_for_status()
    return response.text

if __name__ == "__main__":
    mcp.run()
