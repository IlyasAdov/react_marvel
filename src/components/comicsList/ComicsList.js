import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import './comicsList.scss';

const ComicsList = () => {
    const [charList, setCharList] = useState([]),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(0),
          [charEnded, setCharEnded] = useState(false),
          {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])
    
    useEffect(() => {
        if(!charEnded && !newItemLoading) {
            window.addEventListener('scroll', onScroll);
        }

        return () => window.removeEventListener('scroll', onScroll);
    })
    
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset).then(onCharListLoaded);
    }
    
    const onScroll = useCallback(() => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            onRequest(offset, false);
        }
    })
    
    const onCharListLoaded = (newCharList) => {
        let ended = false; 
        if (newCharList.length < 8) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]); 
        setNewItemLoading(false); 
        setOffset(offset => offset + newCharList.length); 
        setCharEnded(ended); 
    }
    
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            // item.thumbnail = item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif' ? 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' : item.thumbnail;
            
            return (
                <li 
                className="comics__item"
                key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });
    
            return (
                <ul className="comics__grid">
                    {items}
                </ul>
            )
        }
    
    const items = renderItems(charList),
          errorMessage = error ? <ErrorMessage/> : null,
          spinner = loading && !newItemLoading ? <Spinner/> : null;
    
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;