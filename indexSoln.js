const axios = require('axios');

/**
 * Returns a list of Pokémon names that know the provided move.
 * @param {string} move the name of the move to look for. e.g. 'thunder' or 'water-gun'. The name should be all lowercase and dash delimited.
 * @returns {[string]} a list of Pokémon that know the move.
 * @throws an InvalidArgumentException if the move argument is not a string.
 * @throws an APIUnavailableException if the PokéAPI is unavailable (by rate limiting, for example).
 */
async function findPokémonThatKnowMove(move) {
  const pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=5';
  if (typeof (move) !== 'string') {
    const error = new Error('Provided move is not a string.');
    error.name = 'InvalidArgumentException';
    throw error;
  }
  let result = [];
  let response = {};

  try {
    do {
      response = (await axios.get(response.next ? response.next : pokemonApiUrl)).data;
      console.log(response);
      const pokemonPromises = response.results.map(pokemon => axios.get(pokemon.url));
      const pokemonDetails = (await Promise.all(pokemonPromises)).map(response => response.data);
      const pokemonWithMove = pokemonDetails.filter(pokemon => pokemon.moves.map(move => move.move.name).includes(move));
      result = result.concat(pokemonWithMove.map(pokemon => pokemon.name));
    } while (response.next);
    return result;
  } catch (err) {
    const error = new Error('Pokémon API unavailable.');
    error.name = 'APIUnavailableException';
    error.innerException = err;
    throw error;
  }
}

(async () => {
  console.log(await findPokémonThatKnowMove('tackle'));
})();
