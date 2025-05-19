
/*
import { useState, useEffect } from 'react';
import api from '../FetchLogic'; // путь к вашему API модулю

export const useAllTracks = (track_id = '') => {
    const [trackList, setTrackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTracks = async () => {
            try {
                const response = await api.get(`/v1/music/track/${track_id}`);
                setTrackList(response.data);
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getTracks();
    }, [track_id]);

    return { trackList, loading, error };
};
*/