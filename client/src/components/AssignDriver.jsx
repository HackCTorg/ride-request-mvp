import { useEffect, useState } from 'react';
import DriverSearch from "./DriverSearch";
import { fetchDocument, updateDocument} from "../utils/database";
import VehicleSearch from "./VehicleSearch";
import ConditionallyActiveButton from "./ConditionallyActiveButton";

export default function AssignDriver({selectedRideRequestId, cancelFn}) {

    const [selectedRideRequest, setSelectedRideRequest] = useState({rider: [{fullName:''}], pickupAddress: ''});
    const [selectedDriver, setSelectedDriver] = useState();
    const [selectedVehicle, setSelectedVehicle] = useState();

    const getRideRequest= async () => {
        const rideRequest = await fetchDocument("riderequests", selectedRideRequestId);
        setSelectedRideRequest(rideRequest);
    }

    async function submitSelectedDriver()
    {
        await updateDocument("riderequests", selectedRideRequestId, {
            driverUuid: selectedDriver.uuid.toString(),
            vehicleUuid: selectedVehicle.uuid.toString(),
            rideRequestStatus: 400
        });

        cancelFn();
    }

    useEffect(() => {
        getRideRequest();
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
                <p>{selectedRideRequest.rider[0].fullName} at {selectedRideRequest.pickupAddress}</p>
                <p>{new Date(selectedRideRequest.pickupRequestedTime).toLocaleString()}</p>

                <DriverSearch onDriverSelect={setSelectedDriver} />

                <VehicleSearch onVehicleSelect={setSelectedVehicle} />

                    <div className='flex flex-row gap-4 w-full '>
                        <button
                            onClick={cancelFn}
                            className='bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 text-md rounded-md w-[50%]'>
                            Cancel
                        </button>
                        <ConditionallyActiveButton
                            onClickFn={submitSelectedDriver}
                            isEnabled={selectedDriver && selectedVehicle}
                            text="Submit"
                        />
                    </div>

            </div>
        </div>
    );
}