import { useState} from 'react';
import {createDocument} from "../utils/database";
import FormTextEntryField from "./FormTextEntryField";
import ConditionallyActiveButton from "./ConditionallyActiveButton";

export default function CreateVehicle() {
    const [formData, setFormData] = useState({
        uuid: generateUUID(),
        displayName: '',
        fleetId: '',
        capacity: '',
        serviceArea: '',
        accessibilityFeatures: ''
    });
    const [formIsReady, setFormIsReady] = useState(false);

    function isEveryFieldFilledIn()
    {
        const propertyNames = Object.getOwnPropertyNames(formData);
        let allFieldsAreFilledIn = true;
        for (let propertyName of propertyNames)
        {
            if (formData[propertyName] === '')
            {
                allFieldsAreFilledIn = false;
                break;
            }
        }

        return allFieldsAreFilledIn;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setFormIsReady(isEveryFieldFilledIn());
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const response = await createDocument("vehicles", formData);

            if (response.ok) {
                alert('Vehicle created successfully!');
                // Reset form
                setFormData({
                    uuid: generateUUID(),
                    displayName: '',
                    fleetId: 0,
                    capacity: 0,
                    serviceArea: '',
                    accessibilityFeatures: ''
                });
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

                <FormTextEntryField
                    label="Display name"
                    name="displayName"
                    value={formData.displayName}
                    onChangeFn={handleInputChange}
                />

                <FormTextEntryField
                    label="Fleet ID"
                    name="fleetId"
                    value={formData.fleetId}
                    onChangeFn={handleInputChange}
                />

                <FormTextEntryField
                    label="Capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChangeFn={handleInputChange}
                />

                <FormTextEntryField
                    label="Service area"
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChangeFn={handleInputChange}
                />

                <FormTextEntryField
                    label="Accessibility features"
                    name="accessibilityFeatures"
                    value={formData.accessibilityFeatures}
                    onChangeFn={handleInputChange}
                />

                <ConditionallyActiveButton
                    onClickFn={handleSubmit}
                    isEnabled={formIsReady}
                    text="Submit"
                />

            </form>
        </div>
    );
}

function generateUUID()
{
    return 'xxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}