import { Card, CardBody, Typography } from "@/app/materialTailwindExports";
import React from "react";

export default function RightPage({
  title,
  message = "",
  children,
}: {
  title: string;
  message?: string | Array<string | JSX.Element>;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-10 flex items-center justify-center">
      <Typography variant="h4" color="blue-gray">
        {title}
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        {message}
      </Typography>
      <CardBody> {children}</CardBody>
    </Card>
  );
}
