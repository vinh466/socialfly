import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';
type PropTypes = {
    label?: string
    field: UseFormRegisterReturn<string>
    type?: 'password' | 'select' | 'text' | 'number'
    placeholder?: string
    required?: boolean
    errorMessage?: string
    className?: string
}

function FormInput({ label, field, errorMessage, type = 'text', placeholder, className }: PropTypes) {
    return (
        <div className={`flex flex-col m-2 transition-transform ${className}`}>
            {field && field.name ?
                <>
                    {label &&
                        <label htmlFor={field.name}
                            className='text-sm font-medium m-1'
                        >
                            {label}
                            <span className='text-sm mx-1 text-error'> {errorMessage}</span>
                        </label>
                    }
                    <input
                        type={type}
                        id={field.name} {...field}
                        className='w-full rounded-md p-2 mr-3 bg-slate-200 hover:bg-slate-300 focus:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 dark:focus:bg-slate-500'
                        placeholder={placeholder ? placeholder : ''}
                    />
                </>
                :
                <span>No register input</span>
            }
        </div>
    )
}

export default FormInput