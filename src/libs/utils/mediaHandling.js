export const handleMediaChange = (e, setMessageMedia) => {
    const file = e.target.files[0];

    if (file) {
        setMessageMedia(prev => ({ ...prev, content: file }));

        if (file.type.startsWith("image/")) {
            setMessageMedia(prev => ({ ...prev, type: "image" }));
        } else if (file.type.startsWith("video/")) {
            setMessageMedia(prev => ({ ...prev, type: "video" }));
        }
    }
};