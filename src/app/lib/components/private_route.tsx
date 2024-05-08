import { useAuth } from "../contexts/authContext";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  userLoggedIn: boolean;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useAuth() as AuthContextType;
  const { userLoggedIn } = auth;

  if (!userLoggedIn) {
    router.push("/login");
  }

  return <>{children}</>;
}

export default PrivateRoute;
