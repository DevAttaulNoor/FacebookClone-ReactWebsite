import { useCollectionData } from "./useDataCollection";

export const useChats = () => {
    const { collectionData, loading, error } = useCollectionData('Chats');

    return {
        chats: collectionData ? collectionData : null,
        loading,
        error
    };
};