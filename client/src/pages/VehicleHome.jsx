import CreateVehicle from "../components/CreateVehicle";

export default function VehicleHome() {
    return (
        <div className='bg-gray-100 h-full w-full flex flex-col'>
            <h1>Vehicle Home</h1>
            <CreateVehicle />
        </div>
    );
}