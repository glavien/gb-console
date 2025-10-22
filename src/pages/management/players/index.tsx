import { Icon } from "@/components/icon";
import { usePathname, useRouter } from "@/routes/hooks";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import apiClient from "@/api/apiClient";
import { toast } from "sonner";

// Mock data for players (used as fallback if API fails)
// const PLAYERS = [
//     {
//         id: "1",
//         name: "John Smith",
//         avatar: "/avatars/1.png",
//         team: "Red Dragons",
//         position: "Forward",
//         status: "Active"
//     },
//     {
//         id: "2",
//         name: "Michael Johnson",
//         avatar: "/avatars/2.png",
//         team: "Blue Eagles",
//         position: "Midfielder",
//         status: "Injured"
//     },
//     {
//         id: "3",
//         name: "David Wilson",
//         avatar: "/avatars/3.png",
//         team: "Green Lions",
//         position: "Defender",
//         status: "Active"
//     },
//     {
//         id: "4",
//         name: "James Brown",
//         avatar: "/avatars/4.png",
//         team: "Yellow Tigers",
//         position: "Goalkeeper",
//         status: "Active"
//     },
//     {
//         id: "5",
//         name: "Robert Davis",
//         avatar: "/avatars/5.png",
//         team: "Red Dragons",
//         position: "Forward",
//         status: "Suspended"
//     },
//     {
//         id: "6",
//         name: "William Taylor",
//         avatar: "/avatars/6.png",
//         team: "Blue Eagles",
//         position: "Midfielder",
//         status: "Active"
//     },
//     {
//         id: "7",
//         name: "Thomas Anderson",
//         avatar: "/avatars/7.png",
//         team: "Green Lions",
//         position: "Defender",
//         status: "Active"
//     },
//     {
//         id: "8",
//         name: "Christopher Martin",
//         avatar: "/avatars/8.png",
//         team: "Yellow Tigers",
//         position: "Forward",
//         status: "Injured"
//     },
//     {
//         id: "9",
//         name: "Daniel Thompson",
//         avatar: "/avatars/9.png",
//         team: "Red Dragons",
//         position: "Midfielder",
//         status: "Active"
//     },
//     {
//         id: "10",
//         name: "Joseph White",
//         avatar: "/avatars/10.png",
//         team: "Blue Eagles",
//         position: "Defender",
//         status: "Active"
//     }
// ];

// Player type definition
interface Player {
	id: string;
	disabled: boolean;
	createdAt: string;
}

class PlayersResponse {
	players: Player[] = [];
}

export default function PlayersPage() {
	const { push } = useRouter();
	const pathname = usePathname();

	const [players, setPlayers] = useState<Player[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPlayers = async () => {
			try {
				setLoading(true);
				const response = await apiClient.get<PlayersResponse>({ url: "/players" });
				setPlayers(response.players);
			} catch (error) {
				console.error("Failed to fetch players:", error);
				toast.error("Failed to fetch players. Please try again later.", {
					position: "top-center",
				});
				// Fallback to mock data in case of error
				setPlayers([]);
			} finally {
				setLoading(false);
			}
		};

		void fetchPlayers();
	}, []);

	const columns: ColumnsType<Player> = [
		{
			title: "Player",
			dataIndex: "name",
			width: 300,
			render: (_, record) => {
				return (
					<div className="ml-2 flex flex-col">
						<span className="text-sm">{`Id: ${record.id}`}</span>
						<span className="text-xs text-text-secondary">{`Disabled: ${record.disabled.toString()}`}</span>
					</div>
				);
			},
		},

		{
			title: "Created",
			dataIndex: "createdAt",
			align: "center",
			width: 120,
		},

		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray-500">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							push(`${pathname}/${record.id}`);
						}}
					>
						<Icon icon="mdi:card-account-details" size={18} />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => {}}>
						<Icon icon="solar:pen-bold-duotone" size={18} />
					</Button>
					<Button variant="ghost" size="icon">
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
					</Button>
				</div>
			),
		},
	];

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>Players List</div>
					<Button onClick={() => {}}>Add Player</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					pagination={false}
					columns={columns}
					dataSource={players}
					loading={loading}
					locale={{ emptyText: "No players found" }}
				/>
			</CardContent>
		</Card>
	);
}
