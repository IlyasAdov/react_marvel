import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton'
import useMarvelService from '../../services/MarvelService';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null),
          {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
        
        if (props.charId !== props.charId) {
            updateChar();
        }
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        clearError();
        getCharacter(charId).then(onCharLoaded);
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }
    
    const skeleton = char || error || loading ? null : <Skeleton/>,
          errorMessage = error ? <ErrorMessage/> : null,
          spinner = loading && !error ? <Spinner/> : null,
          content = !(error || loading || !char) ? <View char={char}/> : null;
              
    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, homepage, wiki, comics} = char;
    let {thumbnail} = char;
    let clazz = 'randomchar__img';
    thumbnail = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif' ? 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' : thumbnail;
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') clazz = 'char__not_img';

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} className={clazz}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    // eslint-disable-next-line
                    comics.map((item, i) => {
                        if (i < 10) {
                            return (
                                <li className="char__comics-item" key={i}>
                                    <Link to={item.resourceURI.match(/comics\/\d*/gm)[0]}>{item.name}</Link>
                                </li>
                            );
                        }
                    })
                }
            </ul>
        </>
    );
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;