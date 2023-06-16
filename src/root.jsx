import { Outlet, Link } from "react-router-dom";
import {
  AiOutlineMessage,
  AiOutlineFolderOpen,
  AiOutlineRobot,
} from "react-icons/ai";

export default function Root() {
  return (
    <div className="flex flex-row min-w-screen min-h-screen overflow-hidden">
      <div className="w-20 bg-base-200 flex flex-col gap-2 p-3">
        {/* <Link className="btn btn-ghost" to="/files">
          F
        </Link> */}
        <Link className="btn btn-ghost" to="/notes">
          <AiOutlineFolderOpen className="h-10 w-10" />
        </Link>
        <Link className="btn btn-ghost" to="/messaging">
          <AiOutlineMessage className="h-10 w-10" />
        </Link>
        <Link className="btn btn-ghost" to="/agents">
          <AiOutlineRobot className="h-10 w-10" />
        </Link>
      </div>
      <div className="w-screen h-screen">
        <Outlet />
      </div>
    </div>
  );
}
