

export const createProvider = async (provider) => {
    try {
        const response = await fetch('/api/providers/create-provider', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(provider),
        });

        if (response.ok) {
            alert('Provider created successfully!');
            return true;
        } else {
            const errorData = await response.json();
            alert(`Error creating provider: ${errorData.message}`);
            return false;
        }
    } catch (error) {
        console.error('Error creating provider:', error);
        alert('Error creating provider. Please try again.');
        return false;
    }
}

export const fetchProviders = async () => {
    try {
        const response = await fetch('/api/providers/get-providers');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching providers:', error);
        return [];
    }
}

export const fetchDrivers = async () => {
    try {
        const response = await fetch('/api/providers/get-providers');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return [];
    }
}

export const filterDrivers = (drivers, searchTerm) => drivers.filter(driver =>
    driver.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.uuid.toLowerCase().includes(searchTerm.toLowerCase())
);