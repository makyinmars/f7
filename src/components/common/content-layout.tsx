import { useLingui } from "@lingui/react/macro";
import { Link } from "@tanstack/react-router";
import { APP_LOGO_URL, APP_NAME } from "@/constants/app";
import Footer from "./footer";
import LanguageToggle from "./language-toogle";
import { ModeToggle } from "./mode-toggle";

const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLingui();
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
            <Link to="/">
              <img
                src={APP_LOGO_URL}
                alt={`${APP_NAME} ${t`Logo`}`}
                className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20"
              />
            </Link>
            <div className="flex flex-col gap-1">
              <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
                {APP_NAME}
              </h1>
              <p className="hidden text-muted-foreground text-sm sm:block sm:text-base">
                Manage your tasks with TanStack Start, tRPC, PostgreSQL & React
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
          </div>
        </div>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default ContentLayout;
