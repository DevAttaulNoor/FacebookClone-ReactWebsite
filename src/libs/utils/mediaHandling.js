export const handleMediaChange = (e, setMessageMedia) => {
    const file = e.target.files[0];

    if (file) {
        setMessageMedia(prev => ({ ...prev, media: file }));

        if (file.type.startsWith("image/")) {
            setMessageMedia(prev => ({ ...prev, mediaType: "image" }));
        } else if (file.type.startsWith("video/")) {
            setMessageMedia(prev => ({ ...prev, mediaType: "video" }));
        }
    }
};