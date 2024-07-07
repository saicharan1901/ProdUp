import { useRef } from 'react';

const useSound = (url) => {
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const SoundComponent = () => (
    <audio ref={audioRef} src={url} preload="auto"></audio>
  );

  return [playSound, stopSound, SoundComponent];
};

export default useSound;
