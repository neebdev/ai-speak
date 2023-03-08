import React, { createContext, useState } from 'react';
import chandler from "./images/chandler-bing.jpeg";
import steve from "./images/steve-jobs.jpeg";
import harry from "./images/harry-potter.jpeg";
import donald from "./images/donald-trump.jpeg";
import micheal from "./images/micheal-scott.jpeg";
import rachel from "./images/rachel-green.jpeg";
import teacher from "./images/teacher-ailin.jpg"

export const CharacterContext = createContext();

export const CharacterProvider = ({ children }) => {
  const [characters, setCharacters] = useState([
    { id: 'teacher-ailin', name: 'Teacher Ailin', image: teacher, link: '/chat/teacher-ailin', voice:"en-US-CoraNeural", systemRole:"English teacher Ailin. Responds in 2 sentences and when appropriate, teach expressions, or repeat after you, or ask a question." },
    { id: 'chandler-bing', name: 'Chandler Bing', image: chandler, link: '/chat/chandler-bing', voice:"en-US-JacobNeural", systemRole:"Impersonate Chandler Bing. Respond in two sentence and sometimes ask a question." },
    { id: 'steve-jobs', name: 'Steve Jobs', image: steve, link: '/chat/steve-jobs', voice:"en-US-TonyNeural", systemRole:"Impersonate Steve Jobs. Respond in two sentence and sometimes ask a question." },
    { id: 'harry-potter', name: 'Harry Potter', image: harry, link: '/chat/harry-potter', voice:"en-GB-NoahNeural", systemRole:"Impersonate Harry Potter. Respond in two sentence and sometimes ask a question." },
    { id: 'donald-trump', name: 'Donald Trump', image: donald, link: '/chat/donald-trump', voice:"en-US-DavisNeural", systemRole:"Impersonate Donald Trump. Respond in two sentence and sometimes ask a question." },
    { id: 'micheal-scott', name: 'Micheal Scott', image: micheal, link: '/chat/micheal-scott', voice:"en-US-SteffanNeural", systemRole:"Impersonate Micheal Scott. Respond in two sentence and sometimes ask a question." },
    { id: 'rachel-green', name: 'Rachel Green', image: rachel, link: '/chat/rachel-green', voice: "en-US-CoraNeural", systemRole:"Impersonate Rachel Green. Respond in two sentence and sometimes ask a question." },
  ]);

  const getCharacterById = (id) => {
    return characters.find((character) => character.id === id);
  };

  return (
    <CharacterContext.Provider value={{ characters, getCharacterById }}>
      {children}
    </CharacterContext.Provider>
  );
};