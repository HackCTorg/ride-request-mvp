import RequestRide from '../components/RequestRide';

export default function UserHome() {
    return (
        <div className=' h-full w-full flex flex-col gap-8'>
            <h1 className='text-2xl font-bold'>Home</h1>
            <RequestRide />
        </div>
    );
}