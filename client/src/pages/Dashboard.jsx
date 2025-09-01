import RideRequests from '../components/RideRequests';
import {useState} from "react";
import AssignDriver from "../components/AssignDriver";

export default function Dashboard() {

    const [selectedRideRequestId, setSelectedRideRequestId] = useState(null);

    function closeAssignDriverPanel()
    {
        setSelectedRideRequestId(null);
    }

    return (

        <div className='bg-gray-100 h-full w-full flex flex-col'>
            <h1>ServiceProviderHome</h1>
            {selectedRideRequestId && (
                <AssignDriver
                    selectedRideRequestId={selectedRideRequestId}
                    cancelFn= {closeAssignDriverPanel}
                />
            )}
            {!selectedRideRequestId && (
                <RideRequests callbackFn={setSelectedRideRequestId} />
            )}
        </div>
    );
}