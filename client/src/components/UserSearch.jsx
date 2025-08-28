import { fetchUsers, filterUsers } from '../utils/users';
import Search from './Search';

export default function UserSearch({ onUserSelect }) {

    return (
        <Search
            onUserSelect={onUserSelect}
            fetchDataFn={fetchUsers}
            filterElementsFn={filterUsers}
            renderElementFn={renderUser}
        />
    )

    function renderUser(user, handleUserSelect)
    {
        return (
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
        )
    }
} 