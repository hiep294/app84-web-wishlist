/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

export const CustomPickerItem = observer(({ value, label }) => (
  <option value={value}>
    {label}
    {/*console.log(label)*/}
  </option>
));

const CustomPicker = observer(({ label, onChange, value, pickerItems }) => {
  // useMemo to watch only 'value', except 'onChange' method
  // useMemo not compare in deep, if value is object, array, function, it always re-render again, although value has been not changed
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">- {label} -</option>
      {pickerItems()}
    </select>
  );
});

CustomPicker.propTypes = {
  label: PropTypes.string.isRequired,
  pickerItems: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default CustomPicker;
// there need to 'observer' for both CustomPicker (observer of this should be added to apply opserver of CustomPickerItem, look at line 19)
// and CustomPickerItem for better performance
// like: in client there has one user,
//       but fetch from server, there have two more users
