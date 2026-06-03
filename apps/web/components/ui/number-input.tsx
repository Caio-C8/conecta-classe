"use client";

import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Input } from "@/components/ui/input";

export interface NumberInputProps extends Omit<
  NumericFormatProps,
  "customInput"
> {}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <NumericFormat
        {...props}
        customInput={Input}
        getInputRef={ref}
        inputMode="numeric"
        type="text"
        className={className}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
