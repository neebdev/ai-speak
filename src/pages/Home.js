import React from "react";
import CharacterCard from "../components/CharacterCard";
import "../styles/Home.css";


function Home(){
    return(
    <div className="parent-container">
        <h1>Voice Call With</h1>
        <CharacterCard characterId='teacher-ailin' />
      <div className="character-row">
      
        <CharacterCard characterId='chandler-bing' />
        <CharacterCard characterId='steve-jobs' />
        <CharacterCard characterId='harry-potter' />
      </div>
      <div className="character-row">
        <CharacterCard characterId='donald-trump' />
        <CharacterCard characterId='micheal-scott' />
        <CharacterCard characterId='rachel-green' />
      </div>
    </div>
    );
}
export default Home;