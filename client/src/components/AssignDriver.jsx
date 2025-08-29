import { useEffect, useState } from 'react';
import {fetchRideRequest, updateRideRequest} from '../utils/riderequest';
import {fetchUsers} from "../utils/users";
import DriverSearch from "./DriverSearch";

export default function AssignDriver({selectedRideRequestId, cancelFn}) {

    const [selectedRideRequest, setSelectedRideRequest] = useState(selectedRideRequestId);
    const [selectedDriver, setSelectedDriver] = useState([]);
    const [selectedVehicle, selectedVehicles] = useState([]);
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

    function handleDriverSelect(driver)
    {
        setSelectedDriver(driver);
    }

    async function submitSelectedDriver()
    {
        const documentUpdate = {driverUuid: selectedDriver.uuid.toString()};
        await updateRideRequest(selectedRideRequestId, documentUpdate);
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

                <DriverSearch onDriverSelect={handleDriverSelect} />

                {selectedDriver && (
                    <div className='flex flex-row gap-4 w-full '>
                        <button
                            onClick={cancelFn}
                            className='bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 text-md rounded-md w-[50%]'>Cancel</button>
                        <button
                            onClick={submitSelectedDriver}
                            className='bg-blue-500 hover:bg-blue-600 text-white p-2 text-md rounded-md w-[50%]'>Submit</button>
                    </div>
                )}
            </div>
        </div>
    );
}