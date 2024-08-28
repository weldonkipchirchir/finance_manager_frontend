"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react";
import { getToken } from "@/services/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Transaction } from "@/interfaces/interfaces"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDaysIcon } from "./update-budget"
import { Sidebar } from "./sidebar"
import TopBar from "./topBar"

export function UpdateTransaction() {
  const token = getToken();
  const router = useRouter();

  const [transaction, setTransaction] = useState<Transaction>({
    category: "",
    description: "",
    amount: 0,
    date: "",
  });

  useEffect(() => {
    const fetchTransactionDetails = async (id: number) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 200) {
          setTransaction(data);
        } else {
          toast.error(await res.text());
        }
      }
      catch (error: any) {
        toast.error(error);
      }
    }

    const id = new URLSearchParams(window.location.search).get('id');
    if (id && typeof id === "string") {
      fetchTransactionDetails(parseInt(id));
    }
  }, [token]);

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = {
      category: transaction.category,
      amount: parseFloat(transaction.amount.toString()),
      date: transaction.date,
      description: transaction.description
    }


    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${transaction.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log(formData);
      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        toast.success("Transaction updated");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Failed to update transaction");
      }
    } catch (error: any) {
      console.log(error)
      toast.error("An error occurred while updating the budget");
    }
  }


  return (
    <div className="grid min-h-screen w-full grid-cols-1 gap-6 bg-background p-4 md:grid-cols-[280px_1fr] md:p-6 lg:gap-8">
      <Sidebar />
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
          <TopBar />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <div className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Update Transaction
            </h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Modify the transaction details as needed.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={transaction.amount}
                    onChange={(e) => setTransaction({ ...transaction, amount: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    defaultValue={transaction.category}
                    value={transaction.category}
                    onValueChange={(value) => setTransaction({ ...transaction, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Groceries">Groceries</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Electricity">Electricity</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    className="min-h-32"
                    value={transaction.description}
                    onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarDaysIcon className="mr-2 h-4 w-4" />
                        {transaction.date}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        selected={transaction.date ? new Date(transaction.date) : undefined}
                        onSelect={(date) => date && setTransaction({ ...transaction, date: date.toISOString().split("T")[0] })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </form>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
