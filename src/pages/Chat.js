import React, { useEffect, useContext, useState, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { CharacterContext } from '../CharacterContext';
import { Configuration, OpenAIApi } from "openai"; 
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import ChatBubble from "../components/ChatBubble";
import "../styles/Chat.css";
import axios from 'axios';
import pRetry from 'p-retry';



function Chat(){

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API,
  });
  const openai = new OpenAIApi(configuration);
  const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.REACT_APP_TTS_API, process.env.REACT_APP_TTS_REGION);

  const { characterId } = useParams();
  const navigate = useNavigate();
  const { getCharacterById } = useContext(CharacterContext);  
  const character = getCharacterById(characterId);
  const [recognizedText, setRecognizedText] = useState('');
  const [isRunning, setIsRunning] = useState(true);
  const [messages, setMessages] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const intervalRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const chatEndRef = useRef(null);

  const startRecording = () => {
    console.log("Starting recording...");
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        setMediaRecorder(recorder);
  
        const audioChunks = [];
        recorder.addEventListener('dataavailable', (event) => {
          audioChunks.push(event.data);
        });
  
        recorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
          getSpeechRecognition(audioBlob);
        });
  
        recorder.start();
        setRecording(true);
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  };

const stopRecording = async () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    setRecording(false);
  }
};
//using axios because openai package has a bug
const getSpeechRecognition = async (audioBlob) => {
  const url = 'https://api.openai.com/v1/audio/transcriptions';
  const config = {
    headers: {
      Authorization: `Bearer  ${process.env.REACT_APP_OPENAI_API}`,
      'Content-Type': 'multipart/form-data'
    }
  };

  const formData = new FormData();
  const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
  formData.append('file', file);
  formData.append('model', 'whisper-1');

  axios.post(url, formData, config)
    .then((response) => {
      // Handle success response
      console.log(response.data.text);
      setRecognizedText(response.data.text);
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: response.data.text, isUser: true },
      ]);
      getCharacterResponse(response.data.text);
    })
    .catch((error) => {
      // Handle error response
      console.log(error);
    });
}
  const createCompletion = async () =>{
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": character.systemRole},
        {role: "user", content: "User: " + text + "\n" + character.name + ": "}
      ],
    });
    return completion.data.choices[0].message.content;
  }

  const getCharacterResponse = async (text) => {
    const response = await pRetry(createCompletion(text), {
      onFailedAttempt: error => {
        console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
      },
      retries: 5
    });
    synthesizeCharacterResponse(response, character.voice);
  };
  const synthesizeCharacterResponse = (text, voice) => {
    return new Promise((resolve, reject) => {
      const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
      speechConfig.speechSynthesisVoiceName = voice;
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  
      synthesizer.speakTextAsync(text,
        (result) => {
          if (result) {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              console.log("Speech synthesis succeeded");
              resolve(result.audioData);
              setMessages((prevMessages) => [
                ...prevMessages,
                { message: text, isUser: false },
              ]);
            } else if (result.reason === sdk.ResultReason.Canceled) {
              const cancellation = sdk.CancellationDetails.fromResult(result);
              console.error(`Speech synthesis canceled: ${cancellation.errorDetails}`);
              reject(new Error(`Speech synthesis canceled: ${cancellation.errorDetails}`));
            }
          } else {
            console.error("Synthesis result is undefined");
            reject(new Error("Synthesis result is undefined"));
          }
  
          synthesizer.close();
        },
        (err) => {
          console.error(`Speech synthesis error: ${err}`);
          reject(new Error(`Speech synthesis error: ${err}`));
          synthesizer.close();
        }
      );
    });
  };

  const handleHomeButtonClick = () => {
    navigate("/"); 
  };

  useEffect(() => {
    // Scroll to the chat end when messages change
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          if (newSeconds === 60) {
            setSeconds(0);
            setMinutes(prevMinutes => {
              const newMinutes = prevMinutes + 1;
              if (newMinutes === 60) {
                setMinutes(0);
                setHours(prevHours => prevHours + 1);
              }
              return newMinutes;
            });
          }
          return newSeconds;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);
  
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <>
    <div className="sidebar">
      <h1>{character.name}</h1>
      <img src={character.image} alt={character.name}/>
      <h2>{formattedTime}</h2>
      <div className="buttons">
      <button onClick={handleHomeButtonClick}>
      Home
    </button>
        <button onMouseDown={startRecording} onMouseUp={stopRecording}>{recording ? "Listening....":"Hold to Speak"}</button>
      </div>
    </div>
    <div className="mobile-header">
        <h2>{character.name}</h2>
        <img src={character.image} />
        <p>{formattedTime}</p>
        </div>
    <div className="chat-view">
        {messages.map((message, index) => (
          <ChatBubble message={message.message} isUser={message.isUser} key={index}/>
        ))}
        <div ref={chatEndRef} />
        <button
          onTouchStart={startRecording}
          onTouchEnd={stopRecording} 
          style={{ userSelect: 'none' }}
          >{recording ? "Listening..":"Hold to Speak"}
        </button>
    </div>
    </>
  );
}

export default Chat;