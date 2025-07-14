import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SidebarMenuButton } from "../ui/sidebar";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import PropTypes from "prop-types";

export default function UserPopover({ user, onChangePassword }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <SidebarMenuButton className="cursor-pointer">
          <User className="h-4 w-4" />
          <span>{user?.fullName}</span>
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg uppercase">
              {user?.fullName?.[0] || "U"}
            </div>
            <div>
              <div className="font-semibold text-base">{user?.fullName}</div>
              <div className="text-xs text-muted-foreground">
                @{user?.username}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {user?.email}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={onChangePassword}
          >
            Ganti Password
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

UserPopover.propTypes = {
  user: PropTypes.object,
  onChangePassword: PropTypes.func.isRequired,
};
