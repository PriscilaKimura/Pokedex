  const pokeApi = {};

  function convertPokeApiDetailToPokemonModel(pokeDetail) {
      const pokemon = new Pokemon();
      pokemon.number = pokeDetail.id;
      pokemon.name = pokeDetail.name;
      pokemon.types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
      pokemon.type = pokemon.types[0]; // Usando o primeiro tipo como tipo principal
  
      // Verificando se a sprite desejada existe
      if (pokeDetail.sprites && pokeDetail.sprites.other && pokeDetail.sprites.other.dream_world && pokeDetail.sprites.other.dream_world.front_default) {
          pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
      } else {
          
          pokemon.photo = 'https://cdn.pixabay.com/photo/2020/08/29/16/08/pikachu-5527377_1280.jpg'; 
      }
  
      return pokemon;
  }
  
  pokeApi.getPokemonDetail = (pokemon) => {
      return fetch(pokemon.url)
          .then((response) => {
              if (!response.ok) {
                  throw new Error(`Erro ao carregar os detalhes do Pokémon: ${response.statusText}`);
              }
              return response.json();
          })
          .then(convertPokeApiDetailToPokemonModel);
  };
  
  pokeApi.getPokemons = (offset = 0, limit = 5) => {
      const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
      return fetch(url)
          .then((response) => {
              if (!response.ok) {
                  throw new Error(`Erro ao carregar a lista de Pokémon: ${response.statusText}`);
              }
              return response.json();
          })
          .then((jsonBody) => jsonBody.results)
          .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
          .then((detailRequests) => Promise.all(detailRequests))
          .then((pokemonDetails) => pokemonDetails);
  };
  