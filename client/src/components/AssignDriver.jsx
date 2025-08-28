import { useEffect, useState } from 'react';
import {fetchRideRequest, fetchRideRequests} from '../utils/riderequest';
import {fetchUsers} from "../utils/users";

export default function AssignDriver({selectedRideRequestId, rider}) {

    const [selectedRideRequest, setSelectedRideRequest] = useState(selectedRideRequestId);
    const [driver, setDriver] = useState([]);
    const [vehicle, vehicles] = useState([]);
    const [users, setUsers] = useState([]);

    const getUsers= async () => {

        try {
            const users = await fetchUsers();
            setUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const getRideRequest= async () => {

        try {
            const rideRequest = await fetchRideRequest(selectedRideRequestId);
            setSelectedRideRequest(rideRequest);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    useEffect(() => {

        getRideRequest();
        getUsers();
        const interval = setInterval(async () => {
            getRideRequest();
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='bg-white rounded-lg p-4 shadow-md w-full'>
            <h1 className='text-xl font-bold'>Ride Requests</h1>
            <hr className='my-2 border-gray-300' />
            <div className='flex flex-col gap-4'>
                <h1>Choose Drivers and Vehicles</h1>
                <p>Choose from the available Drivers and Vehicles for the days and times requested</p>

                <p>Ride pickup requested for</p>
                <p>{users.find(user => user.uuid === selectedRideRequest.serviceUserUuid)?.fullname} at {selectedRideRequest.pickupAddress}</p>
                <p>{new Date(selectedRideRequest.pickupRequestedTime).toLocaleString()}</p>

            </div>
        </div>
    );
}