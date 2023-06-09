import { useState, useEffect, useRef, useId } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import _ from "lodash";

import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  min-height: 100%;
  height: calc(2.25rem + 2px);
  width: 100%;
`;

const DropdownMenuContainer = styled.div`
  background: #fff;
  border: 1px solid #ced4da;
  position: absolute;
  width: 100%;
  z-index: 10;
  max-height: 15em;
  overflow-y: auto;
`;

const DropdownListItem = styled.li`
  cursor: pointer;
  padding: 6px 12px;
  ${(props) => (props.selected ? "background: #dee2e6;" : "")}

  &:hover {
    background-color: #0074f0;
    color: white;
  }
`;

const SelectInput = styled.select.attrs((props) => ({
  className: `form-control`,
}))`
  cursor: pointer;
  height: 100%;
  ${(props) =>
    props.isShown
      ? `
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: inset 0 0 0 transparent`
      : ""};
`;

export default function SelectSearch({
  options,
  renderItem,
  onSelect,
  getSelectValue,
  placeholder,
  field,
  isInvalid,
}) {
  const { filteredOptions, filter, handleFilter } = useFilter(
    options,
    getSelectValue
  );
  const { isShown, ref, selectorRef, setIsShown } = useShowDropdown();

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsShown(!isShown);
  };

  const handleSelect = (option) => () => {
    setIsShown(false);
    field.onChange(option);
    try {
      onSelect(option);
    } catch (error) {
      console.warn("No custom select handler option");
    }
  };

  const getValue = () => {
    try {
      return getSelectValue(field?.value);
    } catch (error) {
      return undefined;
    }
  };

  return (
    <DropdownContainer>
      <div
        style={{ height: "100%" }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={toggleDropdown}
      >
        <SelectInput
          className={`${isInvalid ? "is-invalid" : ""}`}
          name={field.name}
          onBlur={field.onBlur}
          ref={(el) => {
            field.ref(el);
            selectorRef.current = el;
          }}
          value={getValue()}
          onChange={() => {}}
        >
          <option></option>
          {options.map((option, i) => (
            <option value={getSelectValue(option)} key={i}>
              {getSelectValue(option)[0]?.toUpperCase() +
                getSelectValue(option)?.slice(1)}
            </option>
          ))}
        </SelectInput>
      </div>
      {isShown && (
        <DropdownMenuContainer ref={ref}>
          <div
            style={{
              padding: 4,
              position: "sticky",
              top: 0,
              left: 0,
              background: "#fff",
            }}
          >
            <input
              value={filter}
              onChange={handleFilter}
              className="form-control"
              type="text"
              placeholder={placeholder}
            />
          </div>

          <ul style={{ padding: 0, listStyle: "none" }}>
            {filteredOptions.length === 0 ? (
              <span className="text-muted">Aucun résultat trouvé</span>
            ) : (
              filteredOptions.map((option, i) => (
                <DropdownListItem onClick={handleSelect(option)} key={i}>
                  {renderItem(option)}
                </DropdownListItem>
              ))
            )}
          </ul>
        </DropdownMenuContainer>
      )}
    </DropdownContainer>
  );
}

export function AsyncSelectSearch({
  loaderFn,
  queryKey,
  resourceName,
  resourceId,
  isInvalid,
  ...props
}) {
  const { isLoading, error, data, isSuccess } = useQuery(
    [resourceName],
    loaderFn
  );

  if (isLoading)
    return (
      <SelectSearch
        {...props}
        isInvalid={isInvalid}
        options={["loading", "loading"]}
        renderItem={(option) => option}
        onSelect={() => {}}
        getSelectValue={(option) => option}
      />
    );
  if (error) toast("Err", { type: "error" });
  return (
    isSuccess && (
      <SelectSearch options={data} isInvalid={isInvalid} {...props} />
    )
  );
}

const SelectionChoiceContainer = styled.ul`
  display: flex;
  list-style: none;
  cursor: pointer;
`;

const SelectionChoice = styled.li`
  background-color: #6f42c1;
  border-color: #643ab0;
  color: #fff;
  padding: 0 10px;
  border-radius: 5px;
  margin-right: 5px;
`;
const SelectionChoiceRemove = styled.span`
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 5px;
  &:hover {
    color: #fff;
  }
`;

export function MultiSelectSearch({
  options,
  renderItem,
  onSelect,
  getSelectValue,
  placeholder,
  field,
  isInvalid,
}) {
  const { filteredOptions, filter, handleFilter } = useFilter(
    options,
    getSelectValue
  );

  const [choices, setChoices] = useState(field.value || []);

  const handleSelect = (option) => () => {
    if (!choices?.some((choice) => _.isEqual(choice, option))) {
      setChoices((prev) => [...prev, option]);
    } else console.log("already chosen one");
  };

  const handleRemoveChoice = (option) => () => {
    setChoices((prev) => prev.filter((choice) => !_.isEqual(choice, option)));
  };

  useEffect(() => {
    onSelect(choices);
    field.onChange(choices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choices]);

  const { isShown, ref, selectorRef, setIsShown } = useShowDropdown();
  const toggleDropdown = () => {
    setIsShown(!isShown);
  };
  return (
    <DropdownContainer>
      <div
        onMouseDown={(e) => e.preventDefault()}
        onClick={toggleDropdown}
        style={{ height: "100%" }}
      >
        <SelectionChoiceContainer
          className={`${
            isInvalid ? "is-invalid form-control" : "form-control"
          }`}
          ref={selectorRef}
        >
          {field.value?.map((choice, i) => (
            <SelectionChoice key={i}>
              {getSelectValue(choice)}
              <SelectionChoiceRemove onClick={handleRemoveChoice(choice)}>
                ×
              </SelectionChoiceRemove>
            </SelectionChoice>
          ))}
        </SelectionChoiceContainer>
      </div>
      {isShown && (
        <DropdownMenuContainer ref={ref}>
          <div
            style={{
              padding: 4,
              position: "sticky",
              top: 0,
              left: 0,
              background: "#fff",
            }}
          >
            <input
              onChange={handleFilter}
              value={filter}
              className="form-control"
              type="text"
              placeholder={placeholder}
            />
          </div>

          <ul style={{ padding: 0, listStyle: "none" }}>
            {filteredOptions.map((option, i) => (
              <DropdownListItem key={i} onClick={handleSelect(option)}>
                {renderItem(option)}
              </DropdownListItem>
            ))}
          </ul>
        </DropdownMenuContainer>
      )}
    </DropdownContainer>
  );
}

function useFilter(options, getSelectValue) {
  const [filter, setFilter] = useState("");
  const handleFilter = (e) => {
    setFilter(e.target.value);
  };
  const filteredOptions = options.filter((option) =>
    getSelectValue(option).toLowerCase().startsWith(filter.toLowerCase())
  );

  return { handleFilter, filteredOptions, filter };
}

function useShowDropdown() {
  const ref = useRef(null);
  const selectorRef = useRef(null);

  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        selectorRef.current &&
        !ref.current.contains(event.target) &&
        !selectorRef.current.contains(event.target)
      ) {
        setIsShown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, selectorRef]);

  return { ref, selectorRef, isShown, setIsShown };
}
