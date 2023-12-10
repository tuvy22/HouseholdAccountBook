import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@/app/materialTailwindExports";

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
      <CardHeader shadow={false} className="w-full mx-auto">
        <Typography variant="h3" className="text-center">
          {title}
        </Typography>
        <Typography className="text-center">{message}</Typography>
      </CardHeader>
      <CardBody className="mx-auto w-full px-0">{children}</CardBody>
    </Card>
  );
}
