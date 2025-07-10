import '../../../css/Playlist.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { doPlaylistDeletion, doPlaylistReceiving, doPlaylistDataPatching } from '../../shared/hooks/PlaylistApi';
import api from '../../shared/api/FetchLogic';
import AudioTracks from '../../widgets/audio/model/AudioTracks'
import { usePlayer } from '../../widgets/audio/model/PlayerContext';
import TrackBar from '../../widgets/audio/ui/TrackBar';


export default function Playlist({ albumId }) {
    const [albumInfo, setAlbumInfo] = useState(null);
    const [trackList, setTrackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [editMode, setEditMode] = useState({ img: false, title: false, description: false });
    const [titleInputValue, setTitleInputValue] = useState()
    
    const { setPlaylist, setTrack } = usePlayer();

    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const titleInputRef = useRef(null)
    const descriptionInputRef = useRef(null)

    const fetchPlaylist = async () => {
        if (!albumId) {
            console.error('Ошибка: albumId не предоставлен');
            setLoading(false);
            return;
        }
        try {
            const data = await doPlaylistReceiving(albumId);
            setAlbumInfo(data);
        } catch (error) {
            console.error('Ошибка при получении плейлиста:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlaylistCallback = useCallback(
        () => fetchPlaylist(), [] 
    )
    const doPlaylistRecievingCallback = useCallback(
        () => doPlaylistReceiving(albumInfo.id), [albumInfo]
    )
    const doTrackSetting = useCallback(
        (t) => setTrack(t), []
    )

    useEffect(() => {
        console.log('Dna');
        fetchPlaylistCallback();
        console.log('Йоу');
    }, [albumId, editMode]);

    useEffect(() => {
        const getTracks = async () => {
            if (!albumInfo || !albumInfo.id) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get(`/v1/music/users_collection/${albumInfo.id}`);
                setTrackList(response.data.tracks);
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getTracks();
    }, [albumInfo]);

    useEffect(() => {
        if (imgFile) {
            handleSubmit();
        }
    }, [imgFile]);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImgFile(file);
            setEditMode((prev) => ({ ...prev, img: true }));
        } else {
            setImgFile(null);
            alert('Пожалуйста, выберите изображение!');
        }
    };

    const handleSubmit = async () => {
        if (!imgFile) {
            alert('Пожалуйста, выберите файл!');
            return;
        }

        if (!albumInfo || !albumInfo.id) {
            alert('Ошибка: информация о плейлисте недоступна.');
            return;
        }

        const formData = new FormData();
        formData.append('cover', imgFile);

        try {
            const response = await api.patch(`/v1/music/users_collection/${albumInfo.id}`, formData);
            console.log('Файл успешно отправлен:', response.data);
            setImgFile(null);
            setEditMode((prev) => ({ ...prev, img: false }));
            setAlbumInfo(response.data); // Обновляем albumInfo, если сервер возвращает новые данные
        } catch (error) {
            console.error('Ошибка при отправке файла:', error);
            alert('Не удалось обновить обложку.');
        }
    };

    if (loading) {
        return <div>Загрузка плейлиста...</div>;
    }

    if (error || !albumInfo) {
        return <div></div>;
    }


    // функции для управления обновлением плейлиста

    const MainButtonList = function ({ albumInfo, navigate }) {
        return (
            <div className="button-toolbar">
                <button className="btn btn-secondary rounded-pill" onClick={ () => {setTrack(trackList[0])}}>
                    <i className="bi bi-play-fill"></i> Play
                </button>
                <button
                    className="btn btn-secondary rounded-pill"
                    onClick={() => {
                        if (albumInfo?.id) {
                            doPlaylistDeletion(albumInfo.id);
                            navigate('/collection_page', { state: { refresh: true } });
                        }
                    }}
                >
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        );
    };
    
    const MainDescription = function ({ goToEditMode, textContent }) {
        return (
            <>
                <p onClick={goToEditMode} className="track-list-album-description editors-concealer">
                    {textContent}
                    <button className = "to-edit-mode-btn" onClick={ goToEditMode }>
                        <i class="bi bi-pencil"></i>
                    </button>
                </p>
                
            </>
        );
    };
    
    const MainDescriptionForm = function ({textContent, descriptionInputRef, collId, setEditMode}){
        return(
            <>
            <form className="description-form" onSubmit={(event) => { handleTextForm(
                    event, descriptionInputRef.current.value, collId, 
                    setEditMode, {description: descriptionInputRef.current.value
                    }
                )}}>
    
                <input
                ref={descriptionInputRef} 
                className = 'edit-field collection-description'
                defaultValue={textContent}>
                </input>
                <button className = "from-edit-mode-btn" type="submit">
                    <i class="bi bi-check"></i>
                </button>
            </form>
            </>
        )
    }
    
    const MainTitle = function ({ textContent, goToEditMode }) {
        return (
            <>
                <h1 onClick={goToEditMode} className="track-list-album-title editors-concealer">{textContent}
                    <button onClick={goToEditMode} className = "to-edit-mode-btn">
                        <i class="bi bi-pencil"></i>
                    </button>
                </h1>
                
            </>
        );
    };
    
    const MainTitleForm = function ({textContent, titleInputRef, collId, setEditMode}){
        return(
            <>
            <form className="title-form" onSubmit={(event) => { handleTextForm(
                    event, titleInputRef.current.value, collId, 
                    setEditMode, {title: titleInputRef.current.value
                    }
                )}}>
    
                <input
                ref={titleInputRef} 
                defaultValue={textContent}
                className = 'edit-field collection-title'>
                </input>
                <button className = "from-edit-mode-btn" type="submit">
                    <i class="bi bi-check"></i>
                </button>
            </form>
            </>
        )
    }
    
    const handleTextForm = async function(event, title, collId, setEditMode, patchData){
        event.preventDefault();
        try {
            const updatedData = await doPlaylistDataPatching(collId, patchData); // Сохраняем результат
            if (updatedData) {
                // Обновляем только часть данных, не теряя остального
                setAlbumInfo(prev => ({ ...prev, ...updatedData }));
            }
            setEditMode(); // Выключаем режим редактирования
        } catch (error) {
            console.error('Ошибка при обновлении данных:', error);
            // Можно показать уведомление пользователю, если нужно
        }
    }
    
    const MainImg = function ({ imgPath, handleImageClick }) {
        return (
            <div className="image-block" onClick={handleImageClick}>
                <img src={imgPath} className="img-fluid rounded d-block" alt="cover" />
            </div>
        );
    };

    // конец функций для управления обновлением плейлиста

    return (
        <div className="container-fluid py-3">
            <div className="row gy-3">
                <div className="col-md-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                        <MainImg imgPath={albumInfo.cover} handleImageClick={handleImageClick} />

                </div>
                <div className="col">
                    <div className="content-block">
                        { editMode.title ?
                            <MainTitleForm 
                            textContent={albumInfo.title} titleInputRef={titleInputRef} 
                            collId ={albumInfo.id} setEditMode={() => setEditMode(prev => ({...prev, title: false}))}>

                            </MainTitleForm>
                            :
                            <MainTitle goToEditMode={() => setEditMode(prev => ({...prev, title: true}))} textContent={albumInfo.title} />
                        }
                        { editMode.description ?
                            <MainDescriptionForm textContent={albumInfo.description} descriptionInputRef={descriptionInputRef}
                             collId ={albumInfo.id} setEditMode={() => setEditMode(prev => ({...prev, description: false}))}>

                            </MainDescriptionForm>
                            :
                            <MainDescription  goToEditMode={() => setEditMode(prev => ({...prev, description: true}))} textContent={albumInfo.description} />
                        }         
                        <p>анекдотов {trackList.length} шт.</p>
                        <MainButtonList albumInfo={albumInfo} navigate={navigate} />
                    </div>
                </div>
                <div className="col-md-3 back-button-container">
                    <div className="block">
                        <button
                            className="btn d-none d-md-block btn-outline-secondary rounded-pill"
                            onClick={() => navigate(-1)}
                        >
                            Назад
                        </button>
                    </div>
                </div>
            </div>

            <div className="row track-list">
               <AudioTracks getCollection={ doPlaylistRecievingCallback }></AudioTracks>
            </div>

            {trackList && trackList.map(track => (
                <TrackBar setTrack = { doTrackSetting } track={ track }></TrackBar>
            ))}
            

            {(!trackList || trackList.length <= 0) && (
                <div className="no-tracks">треков нет</div>
            )}
        </div>
    );
}