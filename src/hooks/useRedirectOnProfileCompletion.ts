import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";


const useRedirectOnProfileCompletion = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const callbackParams = useSearchParams().get("callbackUrl");

  
  useEffect(() => {
    if (status === "authenticated") {
      if (user?.isProfileCompleted === false) router.push("/register/complete-account");
      if (callbackParams) router.push(callbackParams);
      router.push("/");
    } 
  },[status, user, router, callbackParams]);
}

export default useRedirectOnProfileCompletion;