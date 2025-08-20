export const fetchRideRequests = async () => {
    try {
        const response = await fetch('/api/riderequests/get-ride-requests');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching ride requests:', error);
        return [];
    }
}

export const createRideRequest = async (rideRequest) => {
    try {
        const response = await fetch('/api/riderequests/create-ride-request', {
            method: 'POST',
            body: JSON.stringify(rideRequest),
        });
        if (response.ok) {
            alert('User created successfully!');
            return true;
        } else {
            const errorData = await response.json();
            alert(`Error creating user: ${errorData.message}`);
            return false;
        }
    }
    catch (error) {
        console.error('Error creating ride request:', error);
        return false;
    }
}

export const deleteRideRequest = async (uuid) => {
    try {
        const response = await fetch(`/api/riderequests/delete-ride-request/${uuid}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting ride request:', error);
        return [];
    }
}