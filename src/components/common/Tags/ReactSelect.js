import React, { Component } from "react";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";
const ReactSelect = ({ options, name, placeholder, onChange = () => {} }) => {
  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderColor: "black",
      minHeight: "60px",
      // border: "1px solid #2690d0 !important",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        minHeight: "12px",
        // border: "1px solid #2690d0 !important",
      };
    },
  };
  return (
    <Select
      styles={colourStyles}
      isSearchable
      options={options}
      components={{ MenuList, IndicatorSeparator: () => null }}
      onChange={(val) => onChange(val)}
      name={name}
      placeholder={placeholder}
    />
  );
};

export default ReactSelect;

const height = 60;

class MenuList extends Component {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}
