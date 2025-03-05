import { IconExclamationCircle } from "@tabler/icons-react";
import clsx from "clsx";
import { twMerge } from "~/utils/twMerge";
import IconSearch from "./icons/IconSearch";

import { forwardRef, type ReactElement } from "react";
import type { FieldError } from "react-hook-form";

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export interface Input {
  label?: string;
  error?: FieldError | string;
  endContent?: ReactElement | string;
  startContent?: ReactElement | string;
  isRequired?: boolean;
  alert?: string;
  fullWidth?: boolean;
  classNames?: {
    parentClassName?: string;
    inputClassName?: string;
    labelClassName?: string;
    wrapperClassName?: string;
  };
  isSearch?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps & Input>(
  (
    {
      className,
      classNames,
      label,
      error,
      startContent,
      endContent,
      isRequired,
      alert,
      fullWidth,
      isSearch,
      ...props
    },
    ref,
  ) => {
    return (
      <>
        <div
          className={clsx(
            "flex flex-col relative gap-1 w-fit",
            { "w-full": fullWidth },
            classNames?.parentClassName,
          )}
        >
          {/* <div className="w-full flex justify-between">
            {label ? (
              <label className="text-[12px] leading-[13.2px] font-semibold line text-left text-qs-grey-25 uppercase font-ibm">
                {label && label}
              </label>
            ) : (
              ""
            )}
            {subTextLeft && (
              <div className="text-qs-grey-40 text-xs w-full text-right flex-1 flex items-center  justify-end">{subTextLeft}</div>
            )}
          </div> */}
          <div
            className={twMerge(
              "flex gap-1 relative rounded-full bg-white/5 px-3 items-center border border-transparent",
              classNames?.wrapperClassName,
              error && "border border-tw-error/50 bg-tw-error/10",
            )}
          >
            <div className={twMerge("text-white/50 flex gap-2")}>
              {isSearch ? <IconSearch className="h-5 w-5" /> : null}
              {startContent}
            </div>
            <input
              ref={ref}
              className={twMerge(
                "text-base py-[6px] bg-transparent disabled:opacity-50 transition-all disabled:cursor-not-allowed border border-transparent placeholder:text-sm placeholder:text-white/50 flex-1",
                className,
                classNames?.inputClassName,
              )}
              {...props}
            />
            {endContent && <div className={twMerge("text-white/50")}>{endContent}</div>}
          </div>
          {error && (
            <p
              className={clsx(
                " text-xs w-full text-left flex-1 flex items-center gap-1 text-tw-error",
              )}
            >
              <IconExclamationCircle className="h-4 w-4" />
              {typeof error === "string" ? error : error.message}
            </p>
          )}
        </div>
      </>
    );
  },
);

Input.displayName = "Input";
export default Input;
