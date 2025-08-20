import { useEffect, useState } from 'react';
import { fetchRideRequests } from '../utils/riderequest';
import { fetchUsers } from '../utils/users';

export default function RideRequests() {

    const [rideRequests, setRideRequests] = useState([]);
    const [users, setUsers] = useState([]);

    const getRideRequests = async () => {
        try {
            console.log('Fetching ride requests...');
            const rideRequests = await fetchRideRequests();
            console.log('Ride requests:', rideRequests);
            if (rideRequests) {
                const sortedRideRequests = rideRequests.sort((a, b) => {
                    // Sort by pickup requested time (soonest first)
                    const timeA = new Date(a.pickupRequestedTime || 0);
                    const timeB = new Date(b.pickupRequestedTime || 0);
                    return timeA.getTime() - timeB.getTime();
                });
                setRideRequests(sortedRideRequests);
            }

        } catch (error) {
            console.error('Error fetching ride requests:', error);
        }
    }

    const getUsers= async () => {

        try {
            const users = await fetchUsers();
            setUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    useEffect(() => {

        getRideRequests();
        getUsers();
        const interval = setInterval(async () => {
            getRideRequests();
            getUsers();
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='bg-white rounded-lg p-4 shadow-md w-full'>
        <h1 className='text-xl font-bold'>Ride Requests</h1>
        <hr className='my-2 border-gray-300' />
        <div className='flex flex-col gap-4'>
            <table>
                <thead>
                    <tr>
                        <th className='text-left'>Rider</th>
                        <th className='text-left'>Pickup Location</th>
                        <th className='text-left'>Dropoff Location</th>
                        <th className='text-left'>Requested Pickup Time</th>
                        <th className='text-left'>Driver</th>
                        <th className='text-left'>Vehicle</th>
                    </tr>
                </thead>
                <tbody>
                    {rideRequests.map((rideRequest) => (
                        <tr key={rideRequest.uuid}>
                            <td className='text-left'>{users.find(user => user.uuid === rideRequest.serviceUserUuid)?.fullname}</td>
                            <td className='text-left'>{rideRequest.pickupAddress}</td>
                            <td className='text-left'>{rideRequest.dropOffAddress}</td>
                            <td className='text-left'>{rideRequest.pickupRequestedTime ? 
                                new Date(rideRequest.pickupRequestedTime).toLocaleString() : 
                                'No pickup time set'
                            }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}