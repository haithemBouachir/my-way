import { useEffect, useMemo, useRef, useState } from "react";
import "./SelectField.css";

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  required?: boolean;
  className?: string;
};

export function SelectField({
  value,
  options,
  onChange,
  name,
  id,
  required,
  className,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value],
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapRef.current) {
        return;
      }

      if (!wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const buttonClass = className ? `mw-select-trigger ${className}` : "mw-select-trigger";

  return (
    <div className="mw-select-wrap" ref={wrapRef}>
      <button
        type="button"
        className={buttonClass}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        id={id}
      >
        <span>{selected?.label ?? "Select"}</span>
        <span className="mw-select-arrow" aria-hidden="true">
          ▾
        </span>
      </button>

      <input type="hidden" name={name} value={selected?.value ?? ""} required={required} />

      {open ? (
        <ul className="mw-select-list" role="listbox" aria-labelledby={id}>
          {options.map((option) => {
            const active = option.value === selected?.value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={active ? "mw-select-option mw-select-option-active" : "mw-select-option"}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
