import {
  Card,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@/app/materialTailwindExports";

import GroupIcon from "@mui/icons-material/Group";
import Person from "@mui/icons-material/Person";
import { IncomeAndExpense } from "@/app/util/types";
import { formatNumberStringToYen } from "../util/util";

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
            incomeAndExpense.registerUserID)) ? (
        <Popover>
          <PopoverHandler>
            {incomeAndExpense.billingUsers.length == 1 ? (
              <Person className="cursor-pointer hover:text-red-500" />
            ) : (
              <GroupIcon className="cursor-pointer hover:text-red-500" />
            )}
          </PopoverHandler>
          <PopoverContent className="z-[10000]">
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
                          className="leading-none opacity-70"
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
                          <Typography variant="small">
                            {billingUser.userName}
                          </Typography>
                        </td>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <Typography variant="small" className="text-red-500">
                            {formatNumberStringToYen(
                              billingUser.amount.toString()
                            )}
                          </Typography>
                        </td>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <Typography variant="small">
                            {billingUser.liquidationID > 0
                              ? "済"
                              : billingUser.userID !==
                                incomeAndExpense.registerUserID
                              ? "未"
                              : "-"}
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
