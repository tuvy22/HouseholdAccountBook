import React from "react";
import { Alert, Button } from "@material-tailwind/react";
import { colors } from "@material-tailwind/react/types/generic";
import { AlertCustom } from "./AlertCustom";

export interface AlertValue {
  color: colors;
  value: string;
}

export function Alerts({
  alertValues: alertValues,
}: {
  alertValues: AlertValue[];
}) {
  return (
    <>
      {alertValues.length > 0 && (
        <div className="m-1">
          {alertValues.map((item, index) => (
            <div key={index} className="my-1">
              <AlertCustom colorAndValue={item} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
