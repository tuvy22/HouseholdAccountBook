import {
  Card,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@/app/materialTailwindExports";
import React from "react";
import GroupIcon from "@mui/icons-material/Group";
import Person from "@mui/icons-material/Person";
import { IncomeAndExpense } from "@/app/util/types";
import { isMinus } from "@/app/util/util";

const TABLE_INFO_BULLING = [
  { header: "支払", addClassName: "" },
  { header: "金額", addClassName: "" },
  { header: "清算", addClassName: "" },
];

export default function BillingPopover({
  incomeAndExpense,
  notBgGrayUserId: notBgGrayUserId = "",
}: {
  incomeAndExpense: IncomeAndExpense;
  notBgGrayUserId?: string;
}) {
  return (
    <>
      {incomeAndExpense.billingUsers &&
      (incomeAndExpense.billingUsers.length > 1 ||
        (incomeAndExpense.billingUsers.length == 1 &&
          incomeAndExpense.billingUsers[0].userID !==
            incomeAndExpense.registerUserId)) ? (
        <Popover>
          <PopoverHandler>
            {incomeAndExpense.billingUsers.length == 1 ? (
              <Person className="cursor-pointer hover:text-red-500" />
            ) : (
              <GroupIcon className="cursor-pointer hover:text-red-500" />
            )}
          </PopoverHandler>
          <PopoverContent>
            <Card>
              <table className="max-w-full table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_INFO_BULLING.map((info, index) => (
                      <th
                        key={index}
                        className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${info.addClassName}`}
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {info.header}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {incomeAndExpense.billingUsers.map(
                    (billingUser, index: number) => (
                      <tr
                        key={index}
                        className={`break-all ${
                          notBgGrayUserId != "" &&
                          billingUser.userID != notBgGrayUserId &&
                          "bg-gray-300"
                        }`}
                      >
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {billingUser.userID}
                          </Typography>
                        </td>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-red-500"
                          >
                            {`${billingUser.amount}円`}
                          </Typography>
                        </td>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {billingUser.liquidationFg ? "済" : "未"}
                          </Typography>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </Card>
          </PopoverContent>
        </Popover>
      ) : (
        <span className="mx-2">{"-"}</span>
      )}
    </>
  );
}
