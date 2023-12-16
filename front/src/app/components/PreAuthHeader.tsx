import Link from "next/link";
import Logo from "./Logo";
import { Button } from "../materialTailwindExports";

export default function PreAuthHeader({
  isButtonDispay = true,
  buttonLink = "",
  buttonName = "",
}: {
  isButtonDispay?: boolean;
  buttonLink?: string;
  buttonName?: string;
}) {
  return (
    <>
      <header className="p-1 border-b border-green-500  bg-gray-50 flex justify-between items-center flex-wrap gap-2">
        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>
        {isButtonDispay && (
          <div className="ml-auto">
            <Link href={buttonLink}>
              <Button
                type="submit"
                variant="outlined"
                color="green"
                size="lg"
                className="rounded-full"
              >
                {buttonName}
              </Button>
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
