import Select, {
  type StylesConfig,
  type GroupBase,
  type SelectComponentsConfig,
} from "react-select";

interface CustomSelectProps<T extends { label: string; value: string }> {
  onChange: (value: T | null) => void;
  options: T[];
  value: T | null;
  placeholder?: string;
  isLoading?: boolean;
  noOptionMessage?: string;
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;
  isDisabled?: boolean;
  selectedBackgroundColor?: string;
  optionHoverBackgroundColor?: string;
  error?: boolean;
  components?:
    | Partial<SelectComponentsConfig<T, false, GroupBase<T>>>
    | undefined;
  small?: boolean;
  withValue?: boolean;
  customMenu?: boolean;
  menuIsOpen?: boolean;
}

const CustomSelect = <
  T extends {
    label: string;
    value: string;
    color?: string;
    backgroundColor?: string;
  },
>({
  onChange,
  options,
  value,
  placeholder,
  isLoading = false,
  noOptionMessage = "No options available",
  width,
  height,
  minHeight,
  isDisabled = false,
  selectedBackgroundColor,
  error = false,
  components,
  small,
  withValue = false,
  customMenu,
  menuIsOpen,
  ...rest
}: CustomSelectProps<T>) => {
  const selectStyles: StylesConfig<T, false, GroupBase<T>> = {
    control: (base, state) => ({
      ...base,
      height,
      minHeight,
      color: "#7a869a",
      border: small
        ? "none"
        : error
          ? "1px solid #DE3730 !important"
          : withValue
            ? "1px solid var(--textColor) !important"
            : "1px solid #dfe1e6 !important",
      background: small ? "#DCEAF6" : error ? "#FFFBFF" : "#fafbfc",
      fontSize: "14px",
      boxShadow: small ? "none" : "0px 1px 1px rgba(0, 0, 0, 0.1)",
      borderRadius: "3px",
      borderColor:
        state.isFocused && selectedBackgroundColor
          ? `${selectedBackgroundColor} !important`
          : "",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? state.data?.backgroundColor
        : state.isFocused
          ? state.data?.backgroundColor + "cc"
          : "transparent",
      color: state.data?.color,
      borderRadius: "3px",
      fontSize: "14px",
    }),
    placeholder: (base) => ({
      ...base,
      color: error ? "#DE3730" : "#9DB3C1",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: error ? "#DE3730" : "#7a869a",
    }),
    singleValue: (base, state) => ({
      ...base,
      color: state.data?.color,
      marginBottom: small ? "5px" : "0",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "100%",
    }),
    menuList: (base) => ({
      ...base,
      overflow: customMenu ? "initial" : "relative",
    }),
    menu: (base) => ({
      ...base,
      overflow: customMenu ? "initial" : "relative",
    }),
    container: (base) => ({
      ...base,
      width,
    }),
  };

  return (
    <div>
      <Select<T>
        value={value}
        onChange={(selectValue) => onChange(selectValue)}
        options={options}
        isSearchable
        isLoading={isLoading}
        isDisabled={isLoading || isDisabled}
        noOptionsMessage={() => noOptionMessage}
        components={{ IndicatorSeparator: () => null, ...components }}
        placeholder={placeholder}
        styles={selectStyles}
        menuIsOpen={menuIsOpen}
        {...rest}
      />
    </div>
  );
};

export default CustomSelect;
