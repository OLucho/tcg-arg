/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSession } from "~/lib/auth-client";

export function useSession() {
    const queryClient = useQueryClient()

    const { data: session, isFetching } = useQuery({
        queryKey: ["session"],
        queryFn: async () => await getSession(),
        refetchInterval: 5 * 60 * 1000, // Cada 5 minutos
        staleTime: 60 * 1000, // La sesión se considera "fresca" por 1 minuto
    });

    useEffect(() => {
        const sessionExpiresAt = session?.data?.session?.expiresAt;
        if (!sessionExpiresAt) {
            return;
        }

        const expiresAt = new Date(sessionExpiresAt).getTime();
        const timeLeft = expiresAt - Date.now();

        if (timeLeft <= 0) {
            void queryClient.invalidateQueries({ queryKey: ["session"] });
        } else {
            const timeout = setTimeout(() => {
                void queryClient.invalidateQueries({ queryKey: ["session"] });
            }, timeLeft);

            return () => clearTimeout(timeout);
        }
    }, [session, queryClient]);

    const refetchSession = () => queryClient.invalidateQueries({ queryKey: ["session"] });

    return {
        session,
        isLoggedIn: !!session?.data?.user,
        isFetching,
        refetchSession,
    };
}
