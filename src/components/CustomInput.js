/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

const CustomInput = ({ label, onChange, value, type, demoArrayProp }) => {
  // useMemo to watch only 'value', except 'onChange' method
  // useMemo not compare in deep, if value is object, array, function, it always re-render again, although value has been not changed
  return React.useMemo(
    () => (
      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1 }}>{label}</div>
        {console.log('Editting: ', label)}
        <input
          style={{ flexGrow: 3 }}
          value={value}
          onChange={onChange}
          type={type || 'text'}
        />
      </div>
    ),
    [value]
  );
};

export default CustomInput;
