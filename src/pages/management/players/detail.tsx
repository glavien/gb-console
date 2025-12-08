import { useEffect, useState } from "react";
import { useParams } from "@/routes/hooks";
import { Card, CardContent, CardHeader } from "@/ui/card";
import apiClient from "@/api/apiClient";

enum FieldType {
	Int = 0,
	Float = 1,
	String = 2,
	Bool = 3,
	DateTime = 4,
}

interface Field {
	Id: string;
	Name: string;
	Type: number;
	DefInt?: number;
	DefFloat?: number;
	DefString?: string;
	DefBool?: boolean;
	DefDateTime?: string;
	Value?: any;
}

interface CardData {
	Id: string;
	Name: string;
	Fields: Field[];
}

interface Category {
	Id: string;
	Name: string;
	Cards: CardData[];
}

interface Section {
	Id: string;
	Name: string;
	Categories: Category[];
}

interface PlayerApiResponse {
	Player: {
		Id: number;
		DeviceId: string;
	};
	Section: Section;
	FieldIdToValues: Record<string, any>;
}

export default function PlayerProfilePage() {
	const { id } = useParams();
	const [playerData, setPlayerData] = useState<PlayerApiResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeCategory, setActiveCategory] = useState<Category | null>(null);

	useEffect(() => {
		if (!id) return;
		const fetchPlayerData = async () => {
			try {
				setLoading(true);
				const data = await apiClient.get<PlayerApiResponse>({ url: `/players/${id}` });

				if (data.Section?.Categories) {
					data.Section.Categories.forEach((category) => {
						category.Cards.forEach((card) => {
							card.Fields.forEach((field) => {
								const valueObject = data.FieldIdToValues[field.Id];

								if (valueObject) {
									field.Value = Object.values(valueObject)[0];
								} else {
									switch (field.Type) {
										case FieldType.Int:
											field.Value = field.DefInt;
											break;
										case FieldType.Float:
											field.Value = field.DefFloat;
											break;
										case FieldType.String:
											field.Value = field.DefString;
											break;
										case FieldType.Bool:
											field.Value = field.DefBool;
											break;
										case FieldType.DateTime:
											field.Value = field.DefDateTime;
											break;
									}
								}
							});
						});
					});
				}
				setPlayerData(data);
				if (data.Section?.Categories && data.Section.Categories.length > 0) {
					setActiveCategory(data.Section.Categories[0]);
				}
			} catch (err) {
				setError("Failed to fetch player data.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		void fetchPlayerData();
	}, [id]);

	if (loading) return <div>Loading player profile...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!playerData) return <div>Player not found.</div>;

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<div className="text-lg font-medium">
						Player Profile: {playerData?.Player?.DeviceId}
					</div>
				</CardHeader>
			</Card>

			<div className="flex space-x-2 border-b">
				{playerData.Section?.Categories?.map((category) => (
					<button
						key={category.Id}
						onClick={() => setActiveCategory(category)}
						className={`px-4 py-2 text-sm font-medium ${
							activeCategory?.Id === category.Id
								? "border-b-2 border-primary text-primary"
								: "text-text-secondary hover:text-text-primary"
						}`}
					>
						{category.Name}
					</button>
				))}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{activeCategory?.Cards?.map((card) => (
					<Card key={card.Id}>
						<CardHeader>
							<div className="text-base font-semibold">{card.Name}</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{card.Fields?.map((field) => (
									<div key={field.Id} className="flex justify-between text-sm">
										<span className="text-text-secondary">{field.Name}</span>
										<span className="font-medium">
											{field.Value !== null && field.Value !== undefined
												? String(field.Value)
												: "N/A"}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}