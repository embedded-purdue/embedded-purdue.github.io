import { useId } from "react";
import { fieldClass, labelClass } from "./editor-styles";

type StringListEditorProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  addLabel?: string;
  itemLabel?: string;
  placeholder?: string;
  allowReorder?: boolean;
  className?: string;
};

function replaceAt(values: string[], index: number, nextValue: string) {
  return values.map((value, valueIndex) =>
    valueIndex === index ? nextValue : value,
  );
}

function move(values: string[], from: number, to: number) {
  const next = [...values];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function StringListEditor({
  label,
  values,
  onChange,
  addLabel = "Add item",
  itemLabel = "Item",
  placeholder,
  allowReorder = false,
  className,
}: StringListEditorProps) {
  const baseId = useId();

  return (
    <fieldset className={`${labelClass} ${className || ""}`}>
      <legend>{label}</legend>
      <div className="grid gap-1.5 normal-case tracking-normal">
        {values.length === 0 && (
          <p className="border border-dashed border-white/10 px-3 py-2 text-xs leading-5 text-[#8d867b]">
            No {label.toLowerCase()} yet. Add one below.
          </p>
        )}
        {values.map((value, index) => {
          const inputId = `${baseId}-${index}`;
          return (
            <div
              key={inputId}
              className="grid grid-cols-[2rem_1fr_auto] items-center gap-1"
            >
              <span className="grid h-9 place-items-center border border-white/10 bg-black/20 font-mono text-[0.55rem] text-[#8d867b]">
                {index + 1}
              </span>
              <input
                id={inputId}
                aria-label={`${itemLabel} ${index + 1}`}
                className={fieldClass}
                value={value}
                placeholder={placeholder}
                onChange={(event) =>
                  onChange(replaceAt(values, index, event.target.value))
                }
              />
              <div className="flex gap-1">
                {allowReorder && (
                  <>
                    <button
                      type="button"
                      aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`}
                      disabled={index === 0}
                      className="h-9 border border-white/10 px-2 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[#aaa398] transition hover:border-[#daa000]/60 hover:text-[#f3efe6] disabled:cursor-not-allowed disabled:opacity-35"
                      onClick={() => onChange(move(values, index, index - 1))}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`}
                      disabled={index === values.length - 1}
                      className="h-9 border border-white/10 px-2 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[#aaa398] transition hover:border-[#daa000]/60 hover:text-[#f3efe6] disabled:cursor-not-allowed disabled:opacity-35"
                      onClick={() => onChange(move(values, index, index + 1))}
                    >
                      ↓
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="h-9 border border-red-300/30 px-2 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-red-300 transition hover:border-red-300 hover:bg-red-300 hover:text-black"
                  onClick={() =>
                    onChange(
                      values.filter((_, valueIndex) => valueIndex !== index),
                    )
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
        <button
          type="button"
          className="mt-1 w-fit border border-[#daa000]/40 px-2.5 py-1.5 font-mono text-[0.55rem] font-bold uppercase tracking-[0.14em] text-[#daa000] transition hover:border-[#daa000] hover:bg-[#daa000] hover:text-black"
          onClick={() => onChange([...values, ""])}
        >
          + {addLabel}
        </button>
      </div>
    </fieldset>
  );
}
