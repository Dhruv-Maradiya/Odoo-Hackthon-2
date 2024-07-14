import { Autocomplete, TextField, Typography } from '@mui/material'

const CustomAutocomplete = ({
  options,
  id,
  labelFieldName,
  value,
  onChange,
  getOptionLabel,
  renderOption,
  filterOptions,
  isOptionEqualToValue,
  onBlur,
  label,
  error,
  multiple,
  disabled,
  disableListWrap,
  ListboxComponent,
  size,
  disableCloseOnSelect,
  fullWidth
}) => {
  let option
  if (multiple) {
    option = options.filter(option => value?.includes(option[id]))
  } else {
    option = options.find(option => value === option[id])
  }

  const _size = size || 'medium'

  const _getOptionLabel = getOptionLabel ? getOptionLabel : option => option[labelFieldName]

  const _renderOption = renderOption
    ? renderOption
    : (props, option) => {
        return (
          <Typography {...props} component='li' value={option[id]} key={option[id]}>
            {option[labelFieldName]}
          </Typography>
        )
      }

  const _filterOptions = filterOptions
    ? filterOptions
    : (options, state) => {
        return options.filter(option => {
          return option[labelFieldName]?.toLowerCase()?.includes(state.inputValue.toLowerCase())
        })
      }

  const _isOptionEqualToValue = isOptionEqualToValue
    ? isOptionEqualToValue
    : (options, value) => options[id] === value[id]

  return (
    <Autocomplete
      size={_size}
      options={options}
      getOptionLabel={_getOptionLabel}
      renderOption={_renderOption}
      filterOptions={_filterOptions}
      isOptionEqualToValue={_isOptionEqualToValue}
      value={option || null}
      onBlur={onBlur}
      onChange={(e, newValue) => {
        if (multiple) {
          return onChange(newValue.map(item => item[id]) || [])
        }
        onChange(newValue?.[id] || null)
      }}
      renderInput={params => {
        return <TextField {...params} label={label} error={error} size={_size} />
      }}
      disabled={disabled}
      multiple={multiple}
      disableListWrap={disableListWrap}
      ListboxComponent={ListboxComponent}
      disableCloseOnSelect={disableCloseOnSelect}
      fullWidth
    />
  )
}

export default CustomAutocomplete
