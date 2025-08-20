import { useState } from 'react';

const ORGANIZATIONS = ['EASTCONN', 'Generations Health'];

const SERVICE_PROVIDER_ROLES = [
    'Transport Broker',
    'Staff',
    'Fleet Manager',
    'Driver',
    'Admin'
];

const SPECIALIZATIONS = [
    'Caseworker',
    'Nutritionist',
    'Intake'
];

const generateUUID = () => {
    return 'xxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export default function CreateProvider() {
    const [formData, setFormData] = useState({
        uuid: generateUUID(),
        fullName: '',
        title: '',
        organization: '',
        mobilePhone: '',
        serviceProviderRole: '',
        faxPhone: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.organization) {
            newErrors.organization = 'Organization is required';
        }

        if (!formData.mobilePhone.trim()) {
            newErrors.mobilePhone = 'Mobile phone is required';
        }

        if (!formData.serviceProviderRole) {
            newErrors.serviceProviderRole = 'Service provider role is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('/api/providers/create-provider', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Service provider created successfully!');
                // Reset form
                setFormData({
                    uuid: generateUUID(),
                    fullName: '',
                    title: '',
                    organization: '',
                    mobilePhone: '',
                    serviceProviderRole: '',
                    faxPhone: ''
                });
                setErrors({});
            } else {
                const errorData = await response.json();
                alert(`Error creating service provider: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Service Provider</h2>
            <p className="text-gray-600 mb-6">Fill in the information to create a new service provider</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* UUID Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Provider UUID (Auto-generated)
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

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Organization */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization *
                    </label>
                    <select
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.organization ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select organization</option>
                        {ORGANIZATIONS.map(org => (
                            <option key={org} value={org}>{org}</option>
                        ))}
                    </select>
                    {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
                </div>

                {/* Mobile Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Phone *
                    </label>
                    <input
                        type="tel"
                        name="mobilePhone"
                        value={formData.mobilePhone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.mobilePhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter mobile phone number"
                    />
                    {errors.mobilePhone && <p className="text-red-500 text-sm mt-1">{errors.mobilePhone}</p>}
                </div>

                {/* Service Provider Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Provider Role *
                    </label>
                    <select
                        name="serviceProviderRole"
                        value={formData.serviceProviderRole}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.serviceProviderRole ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select role</option>
                        {SERVICE_PROVIDER_ROLES.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    {errors.serviceProviderRole && <p className="text-red-500 text-sm mt-1">{errors.serviceProviderRole}</p>}
                </div>

                {/* Specializations */}
                {formData.serviceProviderRole === 'Staff' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Specializations
                        </label>
                        <select
                            name="specializations"
                            value={formData.specializations}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.specializations ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select specialization</option>
                            {SPECIALIZATIONS.map(specialization => (
                                <option key={specialization} value={specialization}>{specialization}</option>
                            ))}
                        </select>
                    </div>
                )}
                {/* Fax Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fax Phone
                    </label>
                    <input
                        type="tel"
                        name="faxPhone"
                        value={formData.faxPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter fax phone number (optional)"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                        Create Service Provider
                    </button>
                </div>
            </form>
        </div>
    );
}