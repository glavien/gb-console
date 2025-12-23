import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const frontendNavData: NavProps["data"] = [
	{
		name: "sys.nav.dashboard",
		items: [
			{
				title: "sys.nav.players", // Используем ключ перевода или просто "Players", если ключа нет
				path: "/management/players",
				icon: <Icon icon="solar:user-bold-duotone" size="24" />,
			},
			{
				title: "PlayerSaves",
				path: "/management/player-saves",
				icon: <Icon icon="solar:diskette-bold-duotone" size="24" />,
			},
			{
				title: "GameConfigs",
				path: "/management/game-configs",
				icon: <Icon icon="solar:settings-bold-duotone" size="24" />,
			},
		],
	},
];