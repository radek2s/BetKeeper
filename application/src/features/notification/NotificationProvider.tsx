"use client";
import type { DomainEventType } from "@app/server/events/eventDto";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserContext } from "../users/UserProvider";
import type { NotificationType } from "./model";
import { NotificationHandler } from "./NotificationHandler";

type NotificationContextType = {
  notifications: NotificationType[];
  readNotification: (id: string) => void;
  readAll: () => void;
  deleteNotification: (id: string) => void;
  deleteAll: () => void;
};

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: PropsWithChildren) {
  const { id: watcherId } = useUserContext();
  const client = useQueryClient();

  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const deleteNotification = (id: string) => {
    setNotifications((old) =>
      old.filter((notification) => notification.id !== id),
    );
  };

  const readNotification = (id: string) => {
    setNotifications((old) =>
      old.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const readAll = () => {
    setNotifications((old) =>
      old.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!watcherId || !client) return;
    const es = new EventSource(`/api/sse?wid=${watcherId}`);

    es.onmessage = (event) => {
      const { handle } = NotificationHandler(client, watcherId);
      const data: DomainEventType = JSON.parse(event.data);
      const notification = handle(data);
      if (notification) {
        setNotifications((old) => [...old, notification]);
      }

      //   setMessages((prev) => [...prev, data]);
    };
    es.onerror = () => {
      console.error("SSE connection error");
      es.close();
    };
    return () => es.close();
  }, [watcherId]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        readNotification,
        readAll,
        deleteNotification,
        deleteAll,
      }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificiations() {
  const ctx = useContext(NotificationContext);
  if (ctx === null)
    throw new Error("Notification context must be used within provider");
  return ctx;
}
