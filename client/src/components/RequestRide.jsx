import { useState } from 'react';
import UserForm from './UserForm';
import UserSearch from './UserSearch';
import RideRequestForm from './RideRequestForm';
import {fetchFieldsOfDocument} from "../utils/database";

export default function RequestRide() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showBaseForm, setShowBaseForm] = useState(true);
    const [showRideRequestForm, setShowRideRequestForm] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);


    async function handleUserSelect(user)
    {
        const userInfo = await fetchFieldsOfDocument("users", user.uuid, ["uuid", "fullName", "residence"]);
        setSelectedUser(userInfo);
        console.log('Selected user:', user);
    }

    return (
        <div className='flex flex-col gap-4 w-full justify-center items-center'>
            {showBaseForm && (
            <div className='bg-white p-4 rounded-lg shadow-md flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-xl font-bold'>Add a User</h1>
                    <h2 className='text-md'>Add a new user or find an existing user</h2>
                    <button 
                    onClick={() => {
                        setShowBaseForm(false);
                        setShowUserForm(true);
                    }}
                    className='bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-md w-[50%]'>Add a User</button>
                </div>
                <h1 className='text-lg font-bold'>OR</h1>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-xl font-bold'>Create Ride Request</h1>
                    <h2 className='text-lg'>Find an existing user to start a Ride Request</h2>
                    <UserSearch onUserSelect={handleUserSelect} />
                </div>
                {selectedUser && (
                    <div className='flex flex-row gap-4 w-full '>
                        <button 
                        onClick={() => {
                            setShowBaseForm(true);
                            setShowRideRequestForm(false);
                            setShowUserForm(false);
                        }}
                        className='bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 text-md rounded-md w-[50%]'>Cancel</button>
                        <button 
                        onClick={() => {
                            console.log('Request Ride button clicked');
                            setShowRideRequestForm(true);
                            setShowBaseForm(false);
                            setShowUserForm(false);
                            console.log('State updated - showRideRequestForm:', true);
                        }}
                        className='bg-blue-500 hover:bg-blue-600 text-white p-2 text-md rounded-md w-[50%]'>Request Ride</button>
                    </div>
                )}
            </div>
            )}
            {showUserForm && <UserForm setShowBaseForm={setShowBaseForm} setShowUserForm={setShowUserForm} />}
            {showRideRequestForm && <RideRequestForm selectedUser={selectedUser} setShowRideRequestForm={setShowRideRequestForm} setShowBaseForm={setShowBaseForm} setShowUserForm={setShowUserForm} />}
        </div>
    );
}