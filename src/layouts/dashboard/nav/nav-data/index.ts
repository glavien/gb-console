import type { NavItemDataProps } from "@/components/nav/types";
import { GLOBAL_CONFIG } from "@/global-config";
import { useUserPermissions } from "@/store/userStore";
import { checkAny } from "@/utils";
import { useMemo } from "react";
import { backendNavData } from "./nav-data-backend";
import { frontendNavData } from "./nav-data-frontend";

const navData = GLOBAL_CONFIG.routerMode === "backend" ? backendNavData : frontendNavData;

const filterItems = (items: NavItemDataProps[], permissions: string[]): NavItemDataProps[] => {
	const result: NavItemDataProps[] = [];

	items.forEach((item) => {
		const hasPermission = item.auth ? checkAny(item.auth, permissions) : true;

		if (!hasPermission) return;

		const newItem = { ...item };

		if (item.children && item.children.length > 0) {
			const filteredChildren = filterItems(item.children, permissions);

			if (filteredChildren.length === 0) {
				return;
			}
			newItem.children = filteredChildren;
		}

		result.push(newItem);
	});

	return result;
};

const filterNavData = (permissions: string[]) => {
	return navData
		.map((group) => {
			const filteredItems = filterItems(group.items, permissions);

			if (filteredItems.length === 0) {
				return null;
			}

			return {
				...group,
				items: filteredItems,
			};
		})
		.filter((group) => group !== null);
};

export const useFilteredNavData = () => {
	const permissions = useUserPermissions();
	const permissionCodes = useMemo(() => {
		return permissions.map((p: any) => (typeof p === "string" ? p : p.code));
	}, [permissions]);

	const filteredNavData = useMemo(() => filterNavData(permissionCodes), [permissionCodes]);
	return filteredNavData;
};