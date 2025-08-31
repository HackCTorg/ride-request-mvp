import { useState } from 'react';
import {createDocument} from "../utils/database";

// Generate a random UUID
const generateUUID = () => {
    return 'xxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export default function UserForm({ setShowBaseForm, setShowUserForm }) {
    const [formData, setFormData] = useState({
        uuid: generateUUID(),
        fullname: '',
        phone: '',
        dob: '',
        race: '',
        maritalStatus: '',
        residence: {
            current: '',
            last: ''
        },
        income: {
            current: '',
            last: ''
        },
        serviceUserRole: [],
        veteranStatus: '',
        disabilityStatus: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else if (type === 'checkbox') {
            if (checked) {
                setFormData(prev => ({
                    ...prev,
                    serviceUserRole: [...prev.serviceUserRole, value]
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    serviceUserRole: prev.serviceUserRole.filter(role => role !== value)
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.uuid.trim()) newErrors.uuid = 'UUID is required';
        if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.dob.trim()) newErrors.dob = 'Date of birth is required';
        if (!formData.race) newErrors.race = 'Race selection is required';
        if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
        if (!formData.residence.last.trim()) newErrors.residenceLast = 'Last residence is required';
        if (!formData.income.last.trim()) newErrors.incomeLast = 'Last income is required';
        if (formData.serviceUserRole.length === 0) newErrors.serviceUserRole = 'At least one service user role is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const success = await createDocument("users", formData);
        if (success) {
            setFormData({
                uuid: generateUUID(),
                fullname: '',
                phone: '',
                dob: '',
                race: '',
                maritalStatus: '',
                residence: { current: '', last: '' },
                income: { current: '', last: '' },
                serviceUserRole: [],
                veteranStatus: '',
                disabilityStatus: ''
            });
            setErrors({});
            setShowBaseForm(true);
        }

    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">User Registration Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            UUID (Auto-generated)
                        </label>
                        <input
                            type="text"
                            name="uuid"
                            value={formData.uuid}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">This UUID is automatically generated</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.fullname ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter full name"
                        />
                        {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter phone number"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth *
                        </label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.dob ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                    </div>
                </div>

                {/* Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Race *
                        </label>
                        <select
                            name="race"
                            value={formData.race}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.race ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select race</option>
                            <option value="black">Black</option>
                            <option value="white">White</option>
                            <option value="asian">Asian</option>
                            <option value="latino">Latino</option>
                            <option value="native american">Native American</option>
                            <option value="other">Other</option>
                            <option value="prefer not to say">Prefer not to say</option>
                        </select>
                        {errors.race && <p className="text-red-500 text-sm mt-1">{errors.race}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Marital Status *
                        </label>
                        <select
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.maritalStatus ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select marital status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                            <option value="separated">Separated</option>
                            <option value="other">Other</option>
                            <option value="prefer not to say">Prefer not to say</option>
                        </select>
                        {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
                    </div>
                </div>

                {/* Residence Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Residence Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Residence
                            </label>
                            <input
                                type="text"
                                name="residence.current"
                                value={formData.residence.current}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter current residence (optional)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Residence *
                            </label>
                            <input
                                type="text"
                                name="residence.last"
                                value={formData.residence.last}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    errors.residenceLast ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter last residence"
                            />
                            {errors.residenceLast && <p className="text-red-500 text-sm mt-1">{errors.residenceLast}</p>}
                        </div>
                    </div>
                </div>

                {/* Income Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Income Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Income
                            </label>
                            <input
                                type="text"
                                name="income.current"
                                value={formData.income.current}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter current income (optional)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Income *
                            </label>
                            <input
                                type="text"
                                name="income.last"
                                value={formData.income.last}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    errors.incomeLast ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter last income"
                            />
                            {errors.incomeLast && <p className="text-red-500 text-sm mt-1">{errors.incomeLast}</p>}
                        </div>
                    </div>
                </div>

                {/* Service User Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service User Role(s) * (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['rider', 'caregiver', 'relative', 'guardian', 'case manager', 'other'].map((role) => (
                            <label key={role} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="serviceUserRole"
                                    value={role}
                                    checked={formData.serviceUserRole.includes(role)}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700 capitalize">{role}</span>
                            </label>
                        ))}
                    </div>
                    {errors.serviceUserRole && <p className="text-red-500 text-sm mt-1">{errors.serviceUserRole}</p>}
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Veteran Status
                        </label>
                        <select
                            name="veteranStatus"
                            value={formData.veteranStatus}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select veteran status</option>
                            <option value="veteran">Veteran</option>
                            <option value="not veteran">Not Veteran</option>
                            <option value="prefer not to say">Prefer not to say</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Disability Status
                        </label>
                        <select
                            name="disabilityStatus"
                            value={formData.disabilityStatus}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select disability status</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <div className='flex flex-row gap-4 w-full justify-between'>
                    <button 
                        onClick={() => {
                            setShowBaseForm(true);
                            setShowUserForm(false);
                        }}
                        className='bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md'>Cancel</button>
                
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                        >
                            Create User
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}