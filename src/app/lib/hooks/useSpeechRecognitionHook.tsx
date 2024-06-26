import { useEffect, useState } from "react";

let recognition: any = null;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "es-ES";
}

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        console.log("onresult event: ", event);
        setTranscript(event.results[0][0].transcript);
        recognition.stop();
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    setTranscript("");
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognition.stop();
    setIsListening(false);
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognition: recognition !== null
  };
};

export default useSpeechRecognition;
