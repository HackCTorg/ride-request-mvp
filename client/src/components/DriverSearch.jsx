import { fetchDrivers, filterDrivers } from '../utils/providers';
import Search from './Search';

export default function DriverSearch({onDriverSelect}) {

    return (
        <Search
            fetchDataFn={fetchDrivers}
            filterElementsFn={filterDrivers}
            renderElementFn={renderDriver}
            placeHolderText="Start typing driver name or ID"
        />
    )

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