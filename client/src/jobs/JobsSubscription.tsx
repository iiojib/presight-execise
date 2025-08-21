import { createContext, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";
import { io, type Socket } from "socket.io-client";
import type { components } from "../api/v1";

export type JobSubscriptionContext = {
  sessionId: string;
  subscribe: (callback: (data: components["schemas"]["Job"]) => void) => void;
};

export const JobSubscriptionContext = createContext<JobSubscriptionContext>({
  sessionId: "",
  subscribe: () => () => {},
});

type EventMap = {
  "job:completed": (job: components["schemas"]["Job"]) => void;
};

export const JobSubscriptionProvider = () => {
  const [socket, setSocket] = useState<Socket<EventMap> | null>(null);

  useEffect(() => {
    const newSocket = io({
      host: String(import.meta.env["SERVER_HOST"]),
      path: "/ws",
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const context = useMemo(() => {
    if (!socket || !socket.id) return null;

    return {
      sessionId: socket.id,
      subscribe: (callback: (data: components["schemas"]["Job"]) => void) => {
        socket.on("job:completed", callback);

        return () => {
          socket.off("job:completed", callback);
        };
      },
    };
  }, [socket]);

  if (!context) {
    return null;
  }

  return (
    <JobSubscriptionContext.Provider value={context}>
      <Outlet />
    </JobSubscriptionContext.Provider>
  );
};
