import React, { useState, useRef } from "react";
import "./dictionary.css";
import axios from "axios";

const Dictionary = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [apierror, setApierror] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  const fetchData = (name) => {
    axios
      .get(`${baseUrl}${name}`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setData(res.data);
        }
        //   setLoading(false);
      })
      .catch((err) => {
        setApierror(err.message);
        window.location.reload(false);
      });
  };

  const clickBtn = () => {
    fetchData(search);
  };

  const playSound = () => {
    // fetchData(search)
  };
  

  return (
    <div>
      <div className="container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Type the word here.."
            id="inp-word"
            onChange={handleSearch}
            value={search}
          />
          <button id="search-btn" type="submit" onClick={clickBtn}>
            Search
          </button>
        </div>
        <div className="result" id="result">
          <div className="word">
            <h3>{search}</h3>
            <button onClick={playSound}>
              <i className="fas fa-volume-up" onClick={handlePlay}>
                {isPlaying ? "Pause" : "Play"}
              </i>
            </button>
          </div>
          <br />
          {data.map((item, index) => {
            const src = ()=>{
            if(data[0].phonetics[0].audio === "" && data[0].phonetics.length > 1){
              // console.log(data[0].phonetics.length)
              return data[0].phonetics[1].audio
            }else{
              return data[0].phonetics[0].audio
            }}

            return (
              <div key={index}>
                <audio
                  ref={audioRef}
                  src={src()}
                  id="sound"
                ></audio>
                {item.meanings.map((part, index) => {
                  return (
                    <div key={index} className='contain'>
                    <h4>Meaning as {part.partOfSpeech === ('adjective' || 'adverb') ? 'an' : 'a'} {part.partOfSpeech}</h4>
                      <div className="details">
                        <p style={{fontSize: "15px"}}>{part.partOfSpeech}</p>
                        <p style={{fontSize: "15px"}}>{data[0].phonetic}</p>
                      </div>
                      <h4>Antonyms: </h4>
                      <ul>
                        {part.antonyms.map((changes, index) => {
                          return <li key={index}>{changes}</li>;
                        })}
                      </ul>
                      <h4>Synonyms: </h4>
                      <ul>
                        {part.synonyms.map((changes, index) => {
                          return <li key={index}>{changes}</li>;
                        })}
                      </ul>
                      {part.definitions.map((define, index) => {
                        return (
                          <div key={index}>
                            <ul className="word-meaning">
                              <li>
                                {define.definition} <br />
                                <p className="word-example">
                                  Example: {define.example}
                                </p>
                              </li>
                            </ul>
                          </div>
                        );
                      })}
                      <br /><br />
                    </div>
                  );
                })}
              </div>
            );
          })}

          <h3 className="error">{apierror}</h3>
        </div>
      </div>
    </div>
  );
};

export default Dictionary;
