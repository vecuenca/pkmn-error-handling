const axios = require('axios');

async function findPokemonThatKnowMove(move) {
  const pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=5';
  let result = []
  let response = {};

  do {
    response = (await axios.get(response.next ? response.next : pokemonApiUrl)).data;
    const pokemonPromises = response.results.map(pokemon => axios.get(pokemon.url));
    const pokemonDetails = (await Promise.all(pokemonPromises)).map(response => response.data);
    const pokemonWithMove = pokemonDetails.filter(pokemon => pokemon.moves.map(move => move.move.name).includes(move));
    result = result.concat(pokemonWithMove.map(pokemon => pokemon.name))
  } while (response.next);
  return result;
}

(async () => {
  console.log(await findPokemonThatKnowMove('ice-beam'));
})();
