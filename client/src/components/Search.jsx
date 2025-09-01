import { useState, useEffect, useRef } from 'react';

export default function Search({ fetchMatchesFn, placeHolderText, renderElementFn }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredElements, setFilteredElements] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Filter elements based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredElements([]);
            setIsDropdownOpen(false);
        } else {
            setElementsToMatchesAsync(searchTerm);
        }
    }, [searchTerm]);

    async function setElementsToMatchesAsync(searchTerm)
    {
        const filtered = await fetchMatchesFn(searchTerm);
        setFilteredElements(filtered);
        setIsDropdownOpen(filtered.length > 0);
    }

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

    const handleElementSelect = (element) => {
        setSearchTerm(element.fullName || element.displayName); //TODO: better
        setIsDropdownOpen(false);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInputFocus = () => {
        if (filteredElements.length > 0) {
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
                    placeholder={placeHolderText}
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
                    {filteredElements.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                            No elements found
                        </div>
                    ) : (
                        filteredElements.map(element => renderElementFn(element, handleElementSelect))
                    )}
                </div>
            )}

        </div>
    );
} 