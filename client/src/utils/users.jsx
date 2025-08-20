export const createUser = async (user) => {
    try {
        const response = await fetch('/api/users/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            alert('User created successfully!');
            return true;
        } else {
            const errorData = await response.json();
            alert(`Error creating user: ${errorData.message}`);
            return false;
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
        return false;
    }
}

export const fetchUsers = async () => {
    try {
        const response = await fetch('/api/users/get-users');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}