import { useState, useEffect, useRef } from 'react';
import { fetchUsers } from '../utils/users';

export default function UserSearch({ onUserSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch all users when component mounts
    useEffect(() => {
        getUsers();
    }, []);

    // Filter users based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers([]);
            setIsDropdownOpen(false);
        } else {
            const filtered = users.filter(user => 
                user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.uuid.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
            setIsDropdownOpen(filtered.length > 0);
        }
    }, [searchTerm, users]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getUsers = async () => {
        try {
            setIsLoading(true);
            const users = await fetchUsers();
            setUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserSelect = (user) => {
        setSearchTerm(user.fullname);
        setIsDropdownOpen(false);
        if (onUserSelect) {
            onUserSelect(user);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInputFocus = () => {
        if (filteredUsers.length > 0) {
            setIsDropdownOpen(true);
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Search for Existing User
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder="Enter user name or UUID..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    </div>
                )}
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredUsers.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                            No users found
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div
                                key={user.uuid}
                                onClick={() => handleUserSelect(user)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                                <div className="font-medium text-gray-900">{user.fullname}</div>
                                <div className="text-sm text-gray-500">
                                    UUID: {user.uuid} • Phone: {user.phone}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    );
} 