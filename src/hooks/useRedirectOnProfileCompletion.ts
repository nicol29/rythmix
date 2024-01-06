import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const useRedirectOnProfileCompletion = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (status === "authenticated" && user?.isProfileCompleted === false) {
      router.push("/register/complete-account");
    } 
  },[status, user, router]);
}

export default useRedirectOnProfileCompletion;