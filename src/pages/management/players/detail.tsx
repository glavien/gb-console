import { useParams } from "@/routes/hooks";
import { Card, CardContent, CardHeader } from "@/ui/card";

export default function PlayerProfilePage() {
	const { id } = useParams();

	return (
		<Card>
			<CardHeader>
				<div className="text-lg font-medium">Player Profile</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<p>Идентификатор игрока:</p>
					<p className="text-xl font-semibold">{id}</p>
				</div>
			</CardContent>
		</Card>
	);
}
