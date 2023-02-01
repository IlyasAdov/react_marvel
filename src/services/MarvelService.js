import useHttp from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, error, request, clearError} = useHttp(),
          _apiBase = 'https://gateway.marvel.com:443/v1/public/',
          _apiKey = 'apikey=5c02a0353f46ffbe06fcfc4be6d97d44',
          _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComic);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComic(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        };
    }

    const _transformComic = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            description: comic.description,
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            pages: comic.pageCount,
            language: comic.textObjects[0] ? comic.textObjects[0].language : null,
            prices: comic.prices.price
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic, getCharacterByName};
} 

export default useMarvelService;