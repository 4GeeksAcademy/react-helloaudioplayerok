import React, { useState, useRef, useEffect } from 'react';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch('https://playground.4geeks.com/sound/effects')
      .then(response => response.json())
      .then(data => setSongs(data.sound_effects))
      .catch(error => console.error('Error fetching songs:', error));
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    const nextIndex = currentSongIndex + 1 >= songs.length ? 0 : currentSongIndex + 1;
    setCurrentSongIndex(nextIndex);
  };

  const playPrevious = () => {
    const previousIndex = currentSongIndex - 1 < 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(previousIndex);
  };

  useEffect(() => {
    if (songs.length > 0) {
      audioRef.current.src = `https://playground.4geeks.com${songs[currentSongIndex].url}`;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentSongIndex, songs]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg">
            {/* Header with gradient */}
            <div className="card-header bg-primary bg-gradient text-white text-center py-3">
              <h1 className="display-6 mb-0">Sound Effects Player</h1>
            </div>

            <div className="card-body">
              {/* Current Song Info */}
              <div className="text-center mb-4">
                <div className="display-1 text-primary mb-3">🎵</div>
                <h2 className="h4 fw-bold">
                  {songs[currentSongIndex]?.name || 'Loading...'}
                </h2>
                <span className="badge bg-secondary">
                  {songs[currentSongIndex]?.category || ''}
                </span>
              </div>

              {/* Audio Controls */}
              <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
                <button 
                  onClick={playPrevious}
                  className="btn btn-outline-primary btn-lg rounded-circle"
                  title="Previous"
                >
                  ⏮
                </button>
                
                <button 
                  onClick={handlePlayPause}
                  className="btn btn-primary btn-lg rounded-circle"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                
                <button 
                  onClick={playNext}
                  className="btn btn-outline-primary btn-lg rounded-circle"
                  title="Next"
                >
                  ⏭
                </button>
              </div>

              {/* Audio Element */}
              <audio
                ref={audioRef}
                onEnded={playNext}
                className="d-none"
              />

              {/* Playlist */}
              <div className="mt-4">
                <h3 className="h5 mb-3 text-primary">Playlist</h3>
                <div className="list-group">
                  {songs.map((song, index) => (
                    <button
                      key={song.id}
                      onClick={() => {
                        setCurrentSongIndex(index);
                        setIsPlaying(true);
                      }}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                        currentSongIndex === index ? 'active' : ''
                      }`}
                    >
                      <div>
                        <div className="fw-bold">{song.name}</div>
                        <small className={currentSongIndex === index ? 'text-light' : 'text-muted'}>
                          {song.category}
                        </small>
                      </div>
                      {currentSongIndex === index && isPlaying && (
                        <span className="badge bg-light text-primary">▶ Playing</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;