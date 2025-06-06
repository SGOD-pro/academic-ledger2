import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const invoices = [
	{
		invoice: "INV001",
		paymentStatus: "Paid",
		totalAmount: "$250.00",
		paymentMethod: "Credit Card",
	},
	{
		invoice: "INV002",
		paymentStatus: "Pending",
		totalAmount: "$150.00",
		paymentMethod: "PayPal",
	},
	{
		invoice: "INV003",
		paymentStatus: "Unpaid",
		totalAmount: "$350.00",
		paymentMethod: "Bank Transfer",
	},
	{
		invoice: "INV004",
		paymentStatus: "Paid",
		totalAmount: "$450.00",
		paymentMethod: "Credit Card",
	},
	{
		invoice: "INV005",
		paymentStatus: "Paid",
		totalAmount: "$550.00",
		paymentMethod: "PayPal",
	},
	{
		invoice: "INV006",
		paymentStatus: "Pending",
		totalAmount: "$200.00",
		paymentMethod: "Bank Transfer",
	},
	{
		invoice: "INV007",
		paymentStatus: "Unpaid",
		totalAmount: "$300.00",
		paymentMethod: "Credit Card",
	},
];

function FeesRecordTable({data}:{data:FeesRecord[]}) {
	return (
		<Table>
			<TableCaption>A list of transactions.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="">Paid Month</TableHead>
					<TableHead>Paid Date</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((invoice,index) => (
					<TableRow key={index}>
						<TableCell className="font-medium">{invoice.paidMonth}</TableCell>
						<TableCell>{invoice.paidDate}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
export default FeesRecordTable;
