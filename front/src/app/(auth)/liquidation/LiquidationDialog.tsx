// "use client";

// import {
//   Button,
//   Dialog,
//   DialogBody,
//   DialogFooter,
//   DialogHeader,
// } from "@/app/materialTailwindExports";
// import React, { useEffect, useRef } from "react";

// import { IncomeAndExpense } from "@/app/util/types";
// import { CheckedItems } from "./Liquidation";
// import { IncomeAndExpenseTable } from "@/app/components/IncomeAndExpenseTable";

// type Props = {
//   open: boolean;
//   handleOpen: () => void;
//   handleCancel?: () => void;
//   handleOk: () => void;
//   data: IncomeAndExpense[];
//   BillingPopoverNotBgGrayUserId?: string;
//   checkedItems?: CheckedItems;
//   handleCheckboxChange?: (id: number) => void;
// };

// export const LiquidationDialog: React.FC<Props> = ({
//   open,
//   handleOpen,
//   handleCancel = () => {},
//   handleOk,
//   data,
//   BillingPopoverNotBgGrayUserId,
//   checkedItems,
//   handleCheckboxChange,
// }) => {
//   return (
//     <>
//       <Dialog open={open} handler={handleOpen} size={"xl"} className="z-[-1]">
//         <DialogHeader>清算対象選択</DialogHeader>
//         <DialogBody>
//           以下から清算対象を選択した後、清算ボタンを押してください
//           <IncomeAndExpenseTable
//             fetchData={data}
//             isLiquidation={true}
//             BillingPopoverNotBgGrayUserId={BillingPopoverNotBgGrayUserId}
//             checkedItems={checkedItems}
//             handleCheckboxChange={handleCheckboxChange}
//           />
//         </DialogBody>
//         <DialogFooter>
//           <Button
//             variant="text"
//             color="red"
//             onClick={() => {
//               handleCancel();
//               handleOpen();
//             }}
//             className="mr-1"
//           >
//             {"キャンセル"}
//           </Button>
//           <Button
//             variant="gradient"
//             color="green"
//             onClick={() => {
//               handleOk();
//               handleOpen();
//             }}
//           >
//             {"清算"}
//           </Button>
//         </DialogFooter>
//       </Dialog>
//     </>
//   );
// };
