import Search from './Search';
import {fetchCollection} from "../utils/generic-endpoint";

export default function DriverSearch({onDriverSelect}) {

    return (
        <Search
            fetchDataFn={() => fetchCollection("providers")}
            filterElementsFn={filterDrivers}
            renderElementFn={renderDriver}
            placeHolderText="Start typing driver name or ID"
        />
    )

    function filterDrivers(drivers, searchTerm) {
        return drivers.filter(driver =>
            driver.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.uuid.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    function renderDriver(driver, handleElementSelect)
    {
        return (
            <div
                key={driver.uuid}
                onClick={() => {
                    handleElementSelect(driver)
                    onDriverSelect(driver)
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
                <div className="font-medium text-gray-900">{driver.fullName}</div>
                <div className="text-sm text-gray-500">
                    UUID: {driver.uuid} • Phone: {driver.phone}
                </div>
            </div>
        )
    }
} 