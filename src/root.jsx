import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <div
      data-theme="cupcake"
      className="flex flex-row min-w-screen min-h-screen overflow-hidden"
    >
      <div className="w-20 bg-base-200 flex flex-col gap-2 p-3">
        <Link className="btn btn-neutral" to="/python">
          P
        </Link>
        <Link className="btn btn-neutral" to="/files">
          F
        </Link>
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
