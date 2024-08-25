"use client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { JSX, SVGProps, useEffect, useState } from "react";
import { Budget as BudgetType } from "@/interfaces/interfaces"
import { getToken } from "@/services/auth"
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"

export function UpdateBudget() {
  const token = getToken();
  const router = useRouter();

  const [budget, setBudget] = useState<BudgetType>({
    category: "",
    amount: 0,
    start_date: "",
    end_date: "",
  });


  useEffect(() => {
    const fetchBudgetDetails = async (id: number) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 200) {
          setBudget(data);
        } else {
          toast.error(await res.text());
        }
      } catch (error) {
        console.log(error);
      }
    }

    const id = new URLSearchParams(window.location.search).get('id');
    if (id && typeof id === 'string') {
      fetchBudgetDetails(parseInt(id, 10));
    }
  }, [token]);

  const handleUpdateBudget = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = {
      category: budget.category,
      amount: parseFloat(budget.amount.toString()),
      start_date: budget.start_date,
      end_date: budget.end_date,
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/${budget.id}`, {
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
        toast.success("Budget updated");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Failed to update budget");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("An error occurred while updating the budget");
    }
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 gap-6 bg-background p-4 md:grid-cols-[280px_1fr] md:p-6 lg:gap-8">
      <Sidebar />
      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <div className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Update Budget
              </h1>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Budget Details</CardTitle>
                <CardDescription>Update the details of your existing budget entry.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      defaultValue={budget.category}
                      value={budget.category}
                      onValueChange={(value) => setBudget({ ...budget, category: value })}
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
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={budget.amount}
                      onChange={(e) => setBudget({ ...budget, amount: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
                            {budget.start_date}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="single"
                            selected={new Date(budget.start_date)}
                            onSelect={(date) => date && setBudget({ ...budget, start_date: date.toISOString().split("T")[0] })} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="end-date">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="end-date"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarDaysIcon className="mr-2 h-4 w-4" />
                            {budget.end_date}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="single"
                            selected={new Date(budget.end_date)}
                            onSelect={(date) => date && setBudget({ ...budget, end_date: date.toISOString().split("T")[0] })} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                <Button onClick={handleUpdateBudget} type="submit">Update Budget</Button>
              </CardFooter>
            </Card>
        </main>
      </div>
    </div>
  )
}

export function CalendarDaysIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="M5 18h.01" />
      <path d="M9 18h.01" />
      <path d="M13 18h.01" />
      <path d="M17 18h.01" />
      <path d="M7 22h10a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4z" />
    </svg>
  );
}
