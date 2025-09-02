import {rideStatuses} from "../constants/rideRequestStatuses";

export default function AssignedRideStatus({onClickFn: startRideFn, rideRequestStatus, rideStatus}) {

    let output;

    if (rideRequestStatus === 1000 && rideStatus === 100 ) {
        output = (
            <button onclick={startRideFn}>Start Ride</button>
        );
    }
    else
    {
        output = (
            <span>{rideStatuses[rideStatus]}</span>
        )
    }

    return output;
}