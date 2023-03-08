import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CharacterContext } from '../CharacterContext';


function CharacterCard({ characterId }) {
    const { getCharacterById } = useContext(CharacterContext);
    const character = getCharacterById(characterId);
  return (
    <>
    <div className="character-card">
    <Link to={character.link}>
      <img src={character.image} alt={character.name}/>
    </Link>
    <div className="name">{character.name}</div>
    </div>
    </>
  );
}

export default CharacterCard;