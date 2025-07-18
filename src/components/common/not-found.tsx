import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-6 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <svg
                aria-label="Not Found"
                className="h-6 w-6 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Not Found</title>
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="custom-h3">Page Not Found</h2>
              <div className="custom-p text-center text-muted-foreground">
                "The page you are looking for does not exist or has been moved."
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => window.history.back()}
                variant="outline"
              >
                Go Back
              </Button>
              <Button asChild className="flex-1">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
