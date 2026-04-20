import { useState } from 'react'

const normalizeValue = (target) => {
  if (target.type === 'range' || target.type === 'number') {
    return Number(target.value)
  }
  return target.value
}

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name } = event.target
    const value = normalizeValue(event.target)
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  return { values, setValues, errors, setErrors, handleChange }
}
