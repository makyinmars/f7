import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { SIDEBAR_COOKIE_NAME } from "@/components/ui/sidebar";

export const getSidebarCookie = createServerFn({ method: "GET" }).handler(
  () => {
    return getCookie(SIDEBAR_COOKIE_NAME);
  }
);

// HOW TO USE:
//
// const sidebarStateQuery = useSuspenseQuery({
//   queryKey: ["sidebar_state"],
//   queryFn: async () => {
//     const cookieValue = await getCookieValue();
//     if (cookieValue === "true") {
//       return "true";
//     }
//     return "false";
//   },
// });
