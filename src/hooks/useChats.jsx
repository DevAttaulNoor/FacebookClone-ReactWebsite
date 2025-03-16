import { useEffect, useState } from "react"

export const useChats = () => {
    const [chats, setChats] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

    }, [])

    return { chats, loading, error };
}