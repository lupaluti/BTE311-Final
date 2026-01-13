import { useState,useEffect } from "react";

function Content() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMusic = async () => {
    if (!query) return;

    setLoading(true);
    setError("");
    setTracks([]);

    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          query
        )}&entity=song&limit=12`
      );

      if (!res.ok) {
        throw new Error("API isteği başarısız");
      }

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        throw new Error("Sonuç bulunamadı");
      }

      setTracks(
        data.results.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        )
      );
    } catch (err) {
      setError("Bir hata oluştu");
      console.error(err);
    }

    setLoading(false);
  };

    useEffect(() => {
    setQuery("Coldplay");
    }, []);
    

  return (
    <div className="content">
      <input
        type="text"
        placeholder="Şarkı veya sanatçı ara"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchMusic(e);
          }
        }}
      />
      <button onClick={searchMusic}>Ara</button>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="error">{error}</p>}

      <div className="track-list">
        {tracks.map((track) => (
          <div className="track-card" key={track.trackId}>
            <img
              src={track.artworkUrl100.replace("100x100", "300x300")}
              alt={track.trackName}
            />

            <div className="track-info">
              <h3>{track.trackName}</h3>
              <p>{track.artistName}</p>
              <p className="album-name">{track.collectionName}</p>

              <p className="year">
                {new Date(track.releaseDate).getFullYear()}
              </p>

              {track.previewUrl && (
                <audio controls src={track.previewUrl}></audio>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Content;
