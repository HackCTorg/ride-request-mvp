import Search from './Search';
import {fetchTopUserMatches} from "../utils/database";

export default function UserSearch({ onUserSelect }) {

    return (
        <Search
            searchElementName="user"
            fetchMatchesFn={fetchTopUserMatches}
            renderElementFn={renderUser}
            placeHolderText="Start typing user name or ID"
        />
    )

    function renderUser(user, handleUserSelect)
    {
        return (
            <div
                key={user.uuid}
                onClick={() => {
                    handleUserSelect(user)
                    onUserSelect(user)
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
                <div className="font-medium text-gray-900">{user.fullName}</div>
                <div className="text-sm text-gray-500">
                    UUID: {user.uuid} • Phone: {user.phone}
                </div>
            </div>
        )
    }
} 