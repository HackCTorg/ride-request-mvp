import {rideStatuses} from "../constants/rideRequestStatuses";
import {styles} from "../../../server/style/styles";

export default function AssignedRideStatus({onClickFn, rideRequestStatus, rideStatus}) {

    let output;

    if (rideRequestStatus === 1000 && rideStatus === 100 ) {
        output = (
            <button onClick={onClickFn} className={styles.enabledButton}>Start Ride</button>
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