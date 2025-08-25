import {useEffect, useState} from "react";

export const useFetchData = (serviceFunction, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await serviceFunction();
                setData(result);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [serviceFunction, deps]);
    return {data, loading, error};
}