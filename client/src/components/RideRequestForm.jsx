import { useState, useEffect } from 'react';
import {createDocument} from "../utils/database";

export default function RideRequestForm({ selectedUser, setShowRideRequestForm, setShowBaseForm, setShowUserForm }) {
    const [formData, setFormData] = useState({
        riderName: '',
        riderPickupBaseAddress: '',
        rideRequestType: 'Standard',
        accessibilityNeeds: '',
        pickupSameAsBase: false,
        pickupLocation: '',
        dropoffLocation: '',
        roundtrip: false,
        estimatedWaitTime: '',
        pickupRequestedDate: '',
        pickupRequestedTime: '',
        dropoffRequestedDate: '',
        dropoffRequestedTime: ''
    });

    const [errors, setErrors] = useState({});

    // Update rider name when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            setFormData(prev => ({
                ...prev,
                riderName: selectedUser.fullname,
                riderPickupBaseAddress: selectedUser.residence?.current || selectedUser.residence?.last || ''
            }));
        }
    }, [selectedUser]);



    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'pickupSameAsBase') {
            setFormData(prev => ({
                ...prev,
                pickupSameAsBase: checked,
                pickupLocation: checked ? prev.riderPickupBaseAddress : ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.riderName.trim()) newErrors.riderName = 'Rider name is required';
        if (!formData.riderPickupBaseAddress.trim()) newErrors.riderPickupBaseAddress = 'Rider pickup base address is required';
        if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
        if (!formData.dropoffLocation.trim()) newErrors.dropoffLocation = 'Drop-off location is required';
        if (!formData.pickupRequestedDate) newErrors.pickupRequestedDate = 'Pickup requested date is required';
        if (!formData.pickupRequestedTime) newErrors.pickupRequestedTime = 'Pickup requested time is required';
        if (!formData.dropoffRequestedDate) newErrors.dropoffRequestedDate = 'Dropoff requested date is required';
        if (!formData.dropoffRequestedTime) newErrors.dropoffRequestedTime = 'Dropoff requested time is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const rideRequestData = {
                uuid: Date.now(), // Generate unique ID
                serviceUserUuid: selectedUser?.uuid || '',
                serviceUserRole: 'rider',
                pickupAddress: formData.pickupLocation,
                dropOffAddress: formData.dropoffLocation,
                roundTrip: formData.roundtrip,
                pickupRequestedTime: `${formData.pickupRequestedDate}T${formData.pickupRequestedTime}`,
                dropOffRequestedTime: `${formData.dropoffRequestedDate}T${formData.dropoffRequestedTime}`,
                rideStartedActualTime: new Date(),
                pickupActualTime: new Date(),
                dropOffActualTime: new Date(),
                rideCompleteRequestedTime: new Date(),
                rideCompleteActualTime: new Date(),
                rideStatus: 0, // REQUEST_IN_PROGRESS
                purpose: formData.rideRequestType,
                rideRequestStatus: 100, // ALL_RIDE_REQUEST_OPEN
                notes: `Accessibility: ${formData.accessibilityNeeds || 'None'}. Wait time: ${formData.estimatedWaitTime || 'Not specified'}`
            };

            const response = await createDocument("riderequests", rideRequestData);

            if (response.ok) {
                alert('Ride request created successfully!');
                // Reset form
                setFormData({
                    riderName: '',
                    riderPickupBaseAddress: '',
                    rideRequestType: 'Standard',
                    accessibilityNeeds: '',
                    pickupSameAsBase: false,
                    pickupLocation: '',
                    dropoffLocation: '',
                    roundtrip: false,
                    estimatedWaitTime: '',
                    pickupRequestedDate: '',
                    pickupRequestedTime: '',
                    dropoffRequestedDate: '',
                    dropoffRequestedTime: ''
                });
                setErrors({});
            } else {
                const errorData = await response.json();
                alert(`Error creating ride request: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ride Request Form</h2>
            <p className="text-gray-600 mb-6">Fill in Rider information to submit a Ride Request</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rider Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h1>Rider Name: {selectedUser.fullname}</h1>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rider Pickup Base Address
                            </label>
                            <input
                                type="text"
                                name="riderPickupBaseAddress"
                                value={formData.riderPickupBaseAddress}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    errors.riderPickupBaseAddress ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter base address"
                            />
                            {errors.riderPickupBaseAddress && <p className="text-red-500 text-sm mt-1">{errors.riderPickupBaseAddress}</p>}
                        </div>
                </div>
                
                <hr className='border-gray-300' />

                {/* Ride Request Type and Accessibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ride Request Type
                        </label>
                        <select
                            name="rideRequestType"
                            value={formData.rideRequestType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="Standard">Standard</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Medical">Medical</option>
                            <option value="Shopping">Shopping</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Accessibility Needs
                        </label>
                        <select
                            name="accessibilityNeeds"
                            value={formData.accessibilityNeeds}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select accessibility needs</option>
                            <option value="Walker Accessible">Walker Accessible</option>
                            <option value="Wheelchair Accessible">Wheelchair Accessible</option>
                            <option value="Oxygen Tank Accessible">Oxygen Tank Accessible</option>
                        </select>
                    </div>
                </div>

                {/* Pickup Location Checkbox */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="pickupSameAsBase"
                        checked={formData.pickupSameAsBase}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                        Check if Pickup Location is the same as Base Address
                    </label>
                </div>

                {/* Location Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Location
                        </label>
                        <input
                            type="text"
                            name="pickupLocation"
                            value={formData.pickupLocation}
                            onChange={handleInputChange}
                            placeholder="Enter pickup address"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Drop-off Location
                        </label>
                        <input
                            type="text"
                            name="dropoffLocation"
                            value={formData.dropoffLocation}
                            onChange={handleInputChange}
                            placeholder="Enter drop-off address"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.dropoffLocation ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.dropoffLocation && <p className="text-red-500 text-sm mt-1">{errors.dropoffLocation}</p>}
                    </div>
                </div>

                {/* Roundtrip and Wait Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="roundtrip"
                            checked={formData.roundtrip}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label className="text-sm font-medium text-gray-700">Roundtrip</label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estimated Wait Time (Optional)
                        </label>
                        <input
                            type="text"
                            name="estimatedWaitTime"
                            value={formData.estimatedWaitTime}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="ex. 1 hour"
                        />
                    </div>
                </div>

                <hr className='border-gray-300' />

                {/* Date and Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Requested Date
                        </label>
                        <input
                            type="date"
                            name="pickupRequestedDate"
                            value={formData.pickupRequestedDate}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.pickupRequestedDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.pickupRequestedDate && <p className="text-red-500 text-sm mt-1">{errors.pickupRequestedDate}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Requested Time
                        </label>
                        <input
                            type="time"
                            name="pickupRequestedTime"
                            value={formData.pickupRequestedTime}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.pickupRequestedTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.pickupRequestedTime && <p className="text-red-500 text-sm mt-1">{errors.pickupRequestedTime}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dropoff Requested Date
                        </label>
                        <input
                            type="date"
                            name="dropoffRequestedDate"
                            value={formData.dropoffRequestedDate}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.dropoffRequestedDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.dropoffRequestedDate && <p className="text-red-500 text-sm mt-1">{errors.dropoffRequestedDate}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dropoff Requested Time
                        </label>
                        <input
                            type="time"
                            name="dropoffRequestedTime"
                            value={formData.dropoffRequestedTime}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.dropoffRequestedTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.dropoffRequestedTime && <p className="text-red-500 text-sm mt-1">{errors.dropoffRequestedTime}</p>}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-between space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                riderName: '',
                                riderPickupBaseAddress: '',
                                rideRequestType: 'Standard',
                                accessibilityNeeds: '',
                                pickupSameAsBase: false,
                                pickupLocation: '',
                                dropoffLocation: '',
                                roundtrip: false,
                                estimatedWaitTime: '',
                                pickupRequestedDate: '',
                                pickupRequestedTime: '',
                                dropoffRequestedDate: '',
                                dropoffRequestedTime: ''
                            });
                            setErrors({});
                            setShowRideRequestForm(false);
                            setShowBaseForm(true);
                            setShowUserForm(false);
                        }}
                        className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
