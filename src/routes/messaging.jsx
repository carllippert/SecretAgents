import { Outlet, Link } from "react-router-dom";
import LeftPanel from "../components/leftPanel";

export default function Messaging() {
  return (
    <div className="flex flex-row h-full w-full ">
      <LeftPanel>
        <div className="">Messages Container</div>
      </LeftPanel>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}
