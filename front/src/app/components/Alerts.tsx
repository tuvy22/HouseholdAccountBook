import React from "react";
import { Alert, Button } from "@material-tailwind/react";
import { colors } from "@material-tailwind/react/types/generic";
import { AlertCustom, ColorAndValue } from "./AlertCustom";

export function Alerts({ colorAndValue }: { colorAndValue: ColorAndValue[] }) {
  return (
    <>
      {colorAndValue.length > 0 && (
        <div className="m-1">
          {colorAndValue.map((item, index) => (
            <div key={index} className="my-1">
              <AlertCustom colorAndValue={item} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
