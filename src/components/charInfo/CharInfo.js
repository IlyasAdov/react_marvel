import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton'
import MarvelService from '../../services/MarvelService';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null),
          [loading, setLoading] = useState(false),
          [error, setError] = useState(false),
          marvelService = new MarvelService();

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

        onCharLoading();
        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError)
    }

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    
    const skeleton = char || error || loading ? null : <Skeleton/>,
          errorMessage = error ? <ErrorMessage/> : null,
          spinner = loading ? <Spinner/> : null,
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
                                    <a href={item.resourceURI}>{item.name}</a>
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