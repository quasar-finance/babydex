"use client";
import { useToast } from "~/app/hooks";
import { Button } from "../atoms/Button";

import type React from "react";

const TestToasts: React.FC = () => {
  const { toast } = useToast();

  const success = () => {
    toast.success({
      title: "Testing success",
      description: "Description for a toast successfully",
    });
  };
  return (
    <div className="flex flex-wrap gap-4">
      <Button onPress={success}>Testing Success Toast</Button>
      <Button
        onPress={() =>
          toast.warning({
            title: "Testing warning",
            description: "Description for a warning message",
          })
        }
      >
        Testing Danger Toast
      </Button>
      <Button
        onPress={() =>
          toast.info({
            title: "Testing info",
            description: "Description for an info message",
          })
        }
      >
        Testing Info Toast
      </Button>
      <Button
        onPress={() =>
          toast.error({
            title: "Testing Error",
            description: "Description for a toast with an error message",
          })
        }
      >
        Testing Error Toast
      </Button>
      <Button
        onPress={() =>
          toast.loading({
            title: "Loading",
            description: "Description for a toast with a loading message",
          })
        }
      >
        Testing Loading Toast
      </Button>
    </div>
  );
};

export default TestToasts;
