import Search from './Search';
import {fetchCollection} from "../utils/database";

export default function VehicleSearch({onVehicleSelect}) {

    return (
        <Search
            fetchDataFn={()=> fetchCollection("vehicles")}
            filterElementsFn={filterVehicles}
            renderElementFn={renderVehicle}
            placeHolderText="Start typing vehicle name or ID"
        />
    )

    function filterVehicles(vehicles, searchTerm)
    {
        return vehicles.filter(vehicle =>
            vehicle.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    function renderVehicle(vehicle, handleElementSelect)
    {
        return (
            <div
                key={vehicle.uuid}
                onClick={() => {
                    handleElementSelect(vehicle)
                    onVehicleSelect(vehicle)
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
                <div className="font-medium text-gray-900">{vehicle.displayName}</div>
                <div className="text-sm text-gray-500">
                    UUID: {vehicle.uuid}
                </div>
            </div>
        )
    }
} 