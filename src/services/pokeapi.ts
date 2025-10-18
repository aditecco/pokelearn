import type { Pokemon } from "../types";

const BASE_URL = "https://pokeapi.co/api/v2";

const LEGENDARY_POKEMON = [
  144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380,
  381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488,
  489, 490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646,
  647, 648, 649, 716, 717, 718, 719, 720, 721, 785, 786, 787, 788, 789, 790,
  791, 792, 800, 801, 802, 807, 808, 809, 888, 889, 890, 891, 892, 894, 895,
  896, 897, 898,
];

type PokeAPIResponse = {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  cries?: {
    latest?: string;
    legacy?: string;
  };
};

function mapPokemonResponse(data: PokeAPIResponse): Pokemon {
  return {
    id: data.id,
    name: data.name,
    imageUrl: data.sprites.other["official-artwork"].front_default,
    types: data.types.map((t) => t.type.name),
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map((a) => a.ability.name),
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    cries: data.cries,
    isLegendary: LEGENDARY_POKEMON.includes(data.id),
  };
}

export async function getRandomPokemon(
  legendaryOnly = false,
): Promise<Pokemon> {
  let pokemonId: number;

  if (legendaryOnly) {
    const randomIndex = Math.floor(Math.random() * LEGENDARY_POKEMON.length);
    pokemonId = LEGENDARY_POKEMON[randomIndex];
  } else {
    pokemonId = Math.floor(Math.random() * 898) + 1;
  }

  const response = await fetch(`${BASE_URL}/pokemon/${pokemonId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon");
  }

  const data: PokeAPIResponse = await response.json();
  return mapPokemonResponse(data);
}

export async function getPokemonById(id: number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon");
  }

  const data: PokeAPIResponse = await response.json();
  return mapPokemonResponse(data);
}
