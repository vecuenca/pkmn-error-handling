const axios = require('axios');

async function findPokémonThatKnowMove(move) {
  const pokémonApiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=5';
  let result = []
  let response = {};

  do {
    response = (await axios.get(response.next ? response.next : pokémonApiUrl)).data;
    const pokémonPromises = response.results.map(pokémon => axios.get(pokémon.url));
    const pokémonDetails = (await Promise.all(pokémonPromises)).map(response => response.data);
    const pokémonWithMove = pokémonDetails.filter(pokémon => pokémon.moves.map(move => move.move.name).includes(move));
    result = result.concat(pokémonWithMove.map(pokémon => pokémon.name))
  } while (response.next);
  return result;
}

(async () => {
  console.log(await findPokémonThatKnowMove('ice-beam'));
})();
