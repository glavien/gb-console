import type { NavItemDataProps } from "@/components/nav/types";
import { GLOBAL_CONFIG } from "@/global-config";
import { checkAny } from "@/utils";
import { backendNavData } from "./nav-data-backend";
import { frontendNavData } from "./nav-data-frontend";

const filterItems = (items: NavItemDataProps[], permissions: string[]) => {
	return items.filter((item) => {
		const hasPermission = item.auth ? checkAny(item.auth, permissions) : true;

		if (item.children?.length) {
			const filteredChildren = filterItems(item.children, permissions);
			if (filteredChildren.length === 0) {
				return false;
			}
			item.children = filteredChildren;
		}

		return hasPermission;
	});
};

export const useFilteredNavData = () => {
	const navData = GLOBAL_CONFIG.routerMode === "backend" ? backendNavData : frontendNavData;
	return navData;
};