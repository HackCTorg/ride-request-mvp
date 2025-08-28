import RideRequests from '../components/RideRequests';
import {useState} from "react";
import AssignDriver from "../components/AssignDriver";

export default function Dashboard() {

    const [selectedRideRequest, setSelectedRideRequest] = useState(false);

    function asdf(request)
    {
        console.log(request);
        setSelectedRideRequest(request);
    }

    return (

        <div className='bg-gray-100 h-full w-full flex flex-col'>
            <h1>ServiceProviderHome</h1>
            {selectedRideRequest && (
                <AssignDriver selectedRideRequestId={selectedRideRequest} />
            )}
            {!selectedRideRequest && (
                <RideRequests callbackFn={asdf} />
            )}
        </div>
    );
}