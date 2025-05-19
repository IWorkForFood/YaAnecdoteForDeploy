import { useEffect } from "react";
import { usePlayer } from "./PlayerContext";
import TrackBar from "./TrackBar";
import { toMinAndSec } from "./Utils";

const AudioTracks = ({ getCollection }) => {
  const { setPlaylist } = usePlayer();

  useEffect(() => {
    const load = async () => {
      const data = await getCollection();
      const prepared = await Promise.all(
        data.tracks.map(async (track) => {
          const audio = new Audio(track.audio_file);
          await new Promise(resolve => {
            audio.addEventListener("loadeddata", resolve);
          });
          return {
            ...track,
            duration: toMinAndSec(audio.duration),
          };
        })
      );
      setPlaylist(prepared);

    };

    load();
  }, [getCollection]);

  return null; // отображение по желанию
};

export default AudioTracks;
