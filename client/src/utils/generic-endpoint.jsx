export const fetchCollection = async (collectionName) => {
    const endpoint = collectionName == "riderequests" ? `/api/riderequests/aggregate`
        : `/api/${collectionName};`
    const response = await fetch(endpoint);
    return await response.json();
}

export const fetchDocument = async (collectionName, documentId) => {
    const response = await fetch(`/api/${collectionName}/${documentId}`);
    return await response.json();
}

export const createDocument = async (collectionName, document) => {
    return await fetch(`/api/${collectionName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(document),
    });
}

export const updateDocument = async (collectionName, documentId, replacementDoc) => {
    try {
        const response = await fetch(`/api/${collectionName}/${documentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(replacementDoc),
        });
        if (response.ok) {
            alert(`Document ${documentId} updated successfully in collection ${collectionName}!`);
            return true;
        } else {
            const errorData = await response.json();
            alert(`Error updating document ${documentId}in collection ${collectionName}: ${errorData.message}`);
            return false;
        }
    }
    catch (error) {
        console.error(`Error updating document ${documentId}in collection ${collectionName}`, error);
        return false;
    }
}