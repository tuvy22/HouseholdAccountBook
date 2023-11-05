import { User } from "./User";
import { Sidebar } from "./Sidebar";
const Setting = () => (
  <>
    <div className="flex-1 flex items-stretch gap-4">
      <Sidebar />
      <div className="flex-1">
        <User />
      </div>
    </div>
  </>
);

export default Setting;
