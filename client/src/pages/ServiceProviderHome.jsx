import RideRequests from '../components/RideRequests';
import CreateProvider from '../components/CreateProvider';

export default function ServiceProviderHome() {
    return (
        <div className='bg-gray-100 h-full w-full flex flex-col'>
            <h1>ServiceProviderHome</h1>
            <CreateProvider />
        </div>
    );
}