import { api } from "./api";

export const pokemonApi = api.injectEndpoints({
	endpoints: (build) => ({
		getPokemonByName: build.query({
			query: (name) => `pokemon/${name}`,
		}),
	}),
	overrideExisting: false,
});

export const { useGetPokemonByNameQuery } = pokemonApi;
