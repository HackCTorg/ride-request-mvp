export const fetchTopUserMatches = async (searchTerm) => {
    const matches = await fetch(`/api/users/fuzzy/${searchTerm}`);
    return await matches.json();
}

export const fetchTopProviderMatches = async (searchTerm) => {
    const matches = await fetch(`/api/providers/fuzzy/${searchTerm}`);
    return await matches.json();
}

export const fetchTopVehicleMatches = async (searchTerm) => {
    const matches = await fetch(`/api/vehicles/fuzzy/${searchTerm}`);
    return await matches.json();
}

export const fetchCollection = async (collectionName) => {
    const response = await fetch(`/api/${collectionName}`);
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