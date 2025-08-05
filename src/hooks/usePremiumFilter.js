import {useMemo, useState} from "react";

export const usePremiumFilter = (originalData) => {
    const [showPremiumOnly, setShowPremiumOnly] = useState(false);

    const filterData = useMemo(() => {
        if (!Array.isArray(originalData)) return [];
        if (showPremiumOnly) return originalData.filter(customer => customer.totalAmount >= 1000);
        return originalData;
    }, [originalData, showPremiumOnly]);

    return {
        filterData,
        showPremiumOnly,
        setShowPremiumOnly
    };
};