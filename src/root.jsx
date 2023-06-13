import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "@polybase/react";
// import { Auth } from "@polybase/auth";

// const auth = new Auth();

export default function Root() {
  const { auth, state, loading } = useAuth();

  // const signIn = async () => {
  //   const authState = await auth.signIn();
  //   console.log("authState", authState);
  // };

  // useEffect(() => {
  //   console.log("state", state);
  //   // if (!state) {
  //   //   signIn();
  //   // }
  // }, [state]);

  useEffect(() => {
    // Add the auth.onAuthUpdate event listener
    const unsubscribe = auth.onAuthUpdate((authState) => {
      if (authState) {
        // User is logged in, show button to dashboard
        // Do something here to handle the logged-in state
        console.log("authState", authState);
      } else {
        console.log("No Auth State");
        // auth.signIn();
        // User is NOT logged in, show login button
        // Do something here to handle the logged-out state
      }
    });

    // Clean up the event listener on component unmount
    return () => unsubscribe();
  }, []);

  // if (!state) {
  //   //no auth state
  //   return <div>not logged in</div>;
  // }

  return (
    <div className="flex flex-row min-w-screen min-h-screen overflow-hidden">
      <div className="w-20 bg-base-200 flex flex-col gap-2 p-3">
        {/* <Link className="btn btn-neutral" to="/python">
          P
        </Link>
        <Link className="btn btn-neutral" to="/files">
          F
        </Link> */}
        <Link className="btn btn-neutral" to="/messaging">
          M
        </Link>
        <Link className="btn btn-neutral" to="/notes">
          N
        </Link>
      </div>
      <div className="w-screen h-screen">
        <Outlet />
      </div>
    </div>
  );
}
