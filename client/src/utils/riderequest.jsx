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

export const fetchRideRequest = async (requestId) => {
    try {
        const response = await fetch(`/api/riderequests/get-ride-request/${requestId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ride request ${requestId}`, error);
        return [];
    }
}

export const createRideRequest = async (rideRequest) => {
    try {
        const response = await fetch('/api/riderequests/create-ride-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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

export const updateRideRequest = async (rideRequestUuid, replacementDoc) => {
    try {
        const response = await fetch(`/api/riderequests/update-ride-request/${rideRequestUuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(replacementDoc),
        });
        if (response.ok) {
            alert('Ride request updated successfully!');
            return true;
        } else {
            const errorData = await response.json();
            alert(`Error updating ride request: ${errorData.message}`);
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