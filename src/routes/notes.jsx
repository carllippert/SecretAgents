import { Outlet, Link } from "react-router-dom";
import LeftPanel from "../components/leftPanel";

export default function Notes() {
  return (
    <div className="flex flex-row h-full w-full ">
      <LeftPanel>
        <div className="w-32 bg-base-100 flex flex-col gap-2 p-3">
          Notes List Container
        </div>
      </LeftPanel>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}
