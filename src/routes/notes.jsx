import { Outlet, Link } from "react-router-dom";
import LeftPanel from "../components/leftPanel";
import FileExplorer from "../components/fileExplorer";

export default function Notes() {
  return (
    <div className="flex flex-row h-full w-full ">
      <LeftPanel>
        <FileExplorer />
      </LeftPanel>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
