export default function FormTextEntryField({label, name, type, value, onChangeFn}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChangeFn}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="Enter data"
            />
        </div>
    )
}