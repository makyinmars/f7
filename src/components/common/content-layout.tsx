import { Trans, useLingui } from "@lingui/react/macro";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bell,
  ChevronDown,
  CreditCard,
  LogIn,
  LogOut,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_LOGO_URL, APP_NAME } from "@/constants/app";
import { useLogout } from "@/hooks/use-auth";
import { useTRPC } from "@/trpc/react";
import { Button } from "../ui/button";
import Footer from "./footer";
import LanguageToggle from "./language-toogle";
import { ModeToggle } from "./mode-toggle";

const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLingui();
  const trpc = useTRPC();
  const sessionQuery = useQuery(trpc.auth.getSession.queryOptions());
  const logout = useLogout();

  const handleLogout = async () => {
    toast.promise(logout.mutateAsync(), {
      loading: t`Logging out...`,
      success: t`Logged out successfully`,
      error: t`Failed to log out. Please try again.`,
    });
  };

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
            {sessionQuery.data?.session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={sessionQuery.data.user.image || ""}
                        alt={sessionQuery.data.user.name}
                      />
                      <AvatarFallback className="text-xs">
                        {sessionQuery.data.user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block">
                      {sessionQuery.data.user.name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={sessionQuery.data.user.image || ""}
                          alt={sessionQuery.data.user.name}
                        />
                        <AvatarFallback>
                          {sessionQuery.data.user.name
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {sessionQuery.data.user.name}
                        </span>
                        <span className="truncate text-muted-foreground text-xs">
                          {sessionQuery.data.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <Sparkles className="mr-2 h-4 w-4" />
                        <Trans>Dashboard</Trans>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      <Trans>Account</Trans>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <Trans>Billing</Trans>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      <Trans>Notifications</Trans>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={logout.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <Trans>Log out</Trans>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" className="gap-2" asChild>
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  <Trans>Login</Trans>
                </Link>
              </Button>
            )}
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
