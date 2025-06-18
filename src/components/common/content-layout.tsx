import { Link } from "@tanstack/react-router";
import { APP_LOGO_URL, APP_NAME } from "@/constants/app";
import { ModeToggle } from "./mode-toggle";

const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <img
              src={APP_LOGO_URL}
              alt={`${APP_NAME} logo`}
              className="h-20 w-20"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-3xl">{APP_NAME}</h1>
            <p className="text-muted-foreground">
              Manage your tasks with TanStack Start, tRPC, PostgreSQL & React
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start">
          <ModeToggle />
        </div>
      </div>
      {children}
    </div>
  );
};

export default ContentLayout;
