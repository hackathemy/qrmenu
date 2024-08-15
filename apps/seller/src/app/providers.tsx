"use client";

import { ReactNode, useEffect } from "react";
import jwt from "jsonwebtoken";
import {
  ApiError,
  apiClient,
  setBaseUrl,
  setBearerAuthorization,
} from "@hackathemy-qrmenu/api-client";
import { TokenPayload } from "@hackathemy-qrmenu/type";
import {
  useAccountStore,
  useSellerStore,
  useSessionStore,
} from "@hackathemy-qrmenu/store";
import { usePathname, useRouter } from "next/navigation";
import { HttpStatusCode } from "axios";
setBaseUrl(process.env.NEXT_PUBLIC_API_URL as string);
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

export default function Providers({
  children,
  accessToken,
}: {
  children: ReactNode;
  accessToken?: string;
}) {
  const setAccessToken = useSessionStore((s) => s.setAccessToken);
  const setAccountId = useSessionStore((s) => s.setAccountId);
  const accountId = useSessionStore((s) => s.accountId);
  const setAccount = useAccountStore((s) => s.setAccount);
  const account = useAccountStore((s) => s.account);
  const setSeller = useSellerStore((s) => s.setSeller);
  const sellerExisting = useSellerStore((s) => s.existing);
  const setSellerExisting = useSellerStore((s) => s.setExisting);

  const pathname = usePathname();
  const router = useRouter();

  console.log(account)
  useEffect(() => {
    if (account) {
      if (!account.phoneNumber && !pathname.startsWith("/sellers/create")) {
        router.push("/sellers/create");
      } else if (
        sellerExisting === false &&
        !pathname.startsWith("/sellers/create")
      ) {
        router.push("/sellers/create");
      }
    }
  }, [account, pathname, sellerExisting]);

  useEffect(() => {
    setAccessToken(accessToken || "");
    setBearerAuthorization(accessToken || "");

    if (accessToken) {
      const paylaod: TokenPayload = jwt.decode(accessToken) as any;
      setAccountId(paylaod.accountId);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accountId) {
      apiClient
        .get("/accounts/" + accountId)
        .then((res) => {
          setAccount(res.data.account);
        })
        .catch(console.error);

      apiClient
        .get("/accounts/" + accountId + "/seller")
        .then((res) => {
          setSeller(res.data.seller);
          setSellerExisting(true);
        })
        .catch((err) => {
          const apiError = err as ApiError;
          if (apiError.status == HttpStatusCode.NotFound) {
            setSellerExisting(false);
          }
          console.error(err);
        });
    }
  }, [accountId]);

  if (accessToken && !accountId) return <></>;
  const matches = window.matchMedia("(pointer: coarse)").matches;

  return (
    <DndProvider
      backend={
        window.matchMedia("(pointer: coarse)").matches
          ? TouchBackend
          : HTML5Backend
      }
    >
      {children}
    </DndProvider>
  );
}
