import { useEffect, useState } from "react";
import "../styles/Game.css"

function shuffleCards(cards) {
    let shuffleCards = [...cards]
      for (let i = shuffleCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffleCards[i], shuffleCards[j]] = [shuffleCards[j], shuffleCards[i]];
  }
  return shuffleCards;
}

function Game() {
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [cards, setCards] = useState([])
    const [clickedID, setClickedID] = useState([])
    const [defaultCards, setDefaultCards] = useState([])

    useEffect(() => {

        async function fetchData() {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=15&offset=0")

                if(!response.ok) {
                    throw new Error("Could not fetch resource")
                }
                
                const data = await response.json()
                // console.log("data log: ", data);
                
                const cleanedCards = data.results.map((pokemon, index) => {
                    const id = index + 1; 
                    return {
                    id: id,
                    name: pokemon.name,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                    };
                });
                // console.log("cleaned cards: ", cleanedCards);
                setCards(cleanedCards);
                setDefaultCards(cleanedCards);
            }
            catch (error) {
                console.error(error)
            }
            
        }
        fetchData();
    }, [])

    // useEffect(() => {
    // if (score > highScore) {
    //     setHighScore(score);
    // }
    // }, [score, highScore]);    

    function handleClickedCard(clickedCard) {
        if (!clickedID.includes(clickedCard)) {
            setClickedID((prev) => [...prev, clickedCard])
            setScore(prevScore => prevScore + 1)
            setCards(shuffleCards(cards));
        } else { // game over
            setClickedID([])
            setCards(defaultCards)
            setScore(0)
            if (score > highScore) {
                setHighScore(score)
            }
        } 
    }

    return (
        <>
        {/*<div style={{ padding: "20px", fontFamily: "monospace" }}>
            <h1>Memory Card Game</h1>
        
            <div>
                {cards.length > 0 
                    ? JSON.stringify(cards, null) 
                    : "Loading data from PokéAPI..."}
            </div>
        </div>*/}

<div className="game-container">
            <div className="header">
                <h1>Pokémon Memory Game</h1>
                <p>Get points by clicking on an image, but don't click on any more than once!</p>
            </div>

            <div className="scoreboard">
                <p>Score: {score}</p>
                <p>High Score: {highScore}</p>
            </div>

            {cards.length === 0 ? (
                <p className="loading-text">Loading...</p>
            ) : (
                <div className="card-grid">
                    {cards.map((pokemon) => (
                        <div 
                            key={pokemon.id} 
                            className="pokemon-card"
                            onClick={() => handleClickedCard(pokemon.id)} 
                        >
                            <img 
                                src={pokemon.image} 
                                alt={pokemon.name} 
                                className="pokemon-image"
                            />
                            <p className="pokemon-name">{pokemon.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    )
}



export default Game