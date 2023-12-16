import { Card, CardBody, Typography } from "@/app/materialTailwindExports";

export default function RightPage({
  title = "",
  message = "",
  children,
}: {
  title?: string;
  message?: string | Array<string | JSX.Element>;
  children: React.ReactNode;
}) {
  return (
    <Card className="mt-4 md:mt-0 p-3 md:p-10">
      <Typography variant="h3" className="text-center">
        {title}
      </Typography>
      <Typography className="text-center">{message}</Typography>

      <CardBody className="flex justify-center items-center w-full px-0">
        {children}
      </CardBody>
    </Card>
  );
}
