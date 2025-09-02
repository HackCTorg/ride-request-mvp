import RequestRide from '../components/RequestRide';

export default function CreateRideRequest() {
    return (
        <div className=' h-full w-full flex flex-col gap-8'>
            <h1 className='text-2xl font-bold'>Create Ride Request</h1>
            <RequestRide />
        </div>
    );
}