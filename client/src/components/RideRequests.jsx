import { useEffect, useState } from 'react';
import {fetchCollection} from "../utils/database";
import AssignedRideStatus from "./AssignedRideStatus";

export default function RideRequests({callbackFn}) {

    const [rideRequests, setRideRequests] = useState([]);
    const [assignedRides, setAssignedRides] = useState([]);

    let fetchInterval;

    const getRideRequests = async () => {
        console.log('Fetching ride requests...');
        const rideRequests = await fetchCollection("riderequests");
        console.log('Ride requests:', rideRequests);
        if (rideRequests) {

            const rideReqsSortedByRrStatus = rideRequests.sort((a, b) => a.rideRequestStatus - b.rideRequestStatus);
            const length = rideReqsSortedByRrStatus.length;

            let pivotIndex = rideReqsSortedByRrStatus.findIndex(rr => parseInt(rr.rideRequestStatus) >= 400);

            let nonActiveRideReqs, assignedRides;

            if (pivotIndex < 0)
            {
                nonActiveRideReqs = rideReqsSortedByRrStatus;
                assignedRides = [];
            }
            else
            {
                nonActiveRideReqs = rideReqsSortedByRrStatus.slice(0, pivotIndex);
                assignedRides = rideReqsSortedByRrStatus.slice(pivotIndex, length);
            }

            setRideRequests(nonActiveRideReqs);
            setAssignedRides(assignedRides);
        }
    }

    useEffect(() => {

        clearInterval(fetchInterval);
        getRideRequests();
        fetchInterval = setInterval(async () => {
            getRideRequests();
        }, 5000);
    }, []);

    return (
        <div className='bg-white rounded-lg p-4 shadow-md w-full'>
            <h1 className='text-xl font-bold'>Ride Requests</h1>
            <hr className='my-2 border-gray-300'/>
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
                            <td className='text-left'>{rideRequest.rider[0].fullName}</td>
                            <td className='text-left'>{rideRequest.pickupAddress}</td>
                            <td className='text-left'>{rideRequest.dropOffAddress}</td>
                            <td className='text-left'>{rideRequest.pickupRequestedTime ?
                                new Date(rideRequest.pickupRequestedTime).toLocaleString() :
                                'No pickup time set'
                            }</td>
                            <td className='text-left'>
                                <button onClick={() => callbackFn(rideRequest.uuid)}>Assign driver</button>
                            </td>
                            <td className='text-left'>
                                <button>Assign vehicle</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <br/>
            <br/>

            <h1 className='text-xl font-bold'>Assigned Rides</h1>
            <hr className='my-2 border-gray-300'/>
            <div className='flex flex-col gap-4'>
                <table>
                    <thead>
                    <tr>
                        <th className='text-left'>Rider</th>
                        <th className='text-left'>Pickup Location</th>
                        <th className='text-left'>Dropoff Location</th>
                        <th className='text-left'>Requested Pickup Time</th>
                        <th className='text-left'>Driver's Number</th>
                        <th className='text-left'>Ride Status</th>
                        <th className='text-left'>Rider's Number</th>
                    </tr>
                    </thead>
                    <tbody>
                    {assignedRides.map((ride) => (
                        <tr key={ride.uuid}>
                            <td className='text-left'>{ride.rider[0].fullName}</td>
                            <td className='text-left'>{ride.pickupAddress}</td>
                            <td className='text-left'>{ride.dropOffAddress}</td>
                            <td className='text-left'>{ride.pickupRequestedTime ?
                                new Date(ride.pickupRequestedTime).toLocaleString() :
                                'No pickup time set'
                                }
                            </td>
                            <td className='text-left'>{ride.driver.phone}</td>
                            <td className='text-left'>
                                <AssignedRideStatus
                                    startRideFn={console.log}
                                    rideRequestStatus={ride.rideRequestStatus}
                                    rideStatus={ride.rideStatus}
                                />
                            </td>
                            <td className='text-left'>{ride.rider[0].phone}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>


        </div>


    );
}