"use client";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Sidebar } from "./sidebar";
import { getToken } from "@/services/auth";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdUpdate } from "react-icons/md";
import { Income as IncomeType } from "@/interfaces/interfaces";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "./topBar";

export function Income() {
  const router = useRouter();
  const [newIncome, setNewIncome] = useState<IncomeType>({
    amount: 0,
    source: "",
    date: "",
  });
  const [income, setIncome] = useState<IncomeType[]>([]);
  const token = getToken();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/incomes`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIncome(data);
      })
      .catch((error) => {
        console.error("Error fetching incomes:", error);
      });
  }, [token, newIncome]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewIncome((prevGoal) => ({
      ...prevGoal,
      [e.target.name]: e.target.value,
    }) as IncomeType);
  }

  const handleSubmit = async () => {
    if (
      !newIncome.amount ||
      !newIncome.source ||
      !newIncome.date
    ) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newIncome),
      });

      if (res.status === 201) {
        toast.success("Income added");
        setNewIncome({
          amount: 0,
          source: "",
          date: "",
        });
      } else {
        toast.error(await res.text());
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (id: number | undefined) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/income/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        toast.success("income deleted")
      } else {
        toast.error(await res.text());
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleUpdate = (id: number | undefined) => {
    router.push(`/income/update?id=${id}`);
  }

  const addIncomeRef = useRef<HTMLDivElement>(null);
  const scrollToAddIncome = () => {
    addIncomeRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="grid min-h-screen w-full grid-cols-1 gap-6 bg-background p-4 md:grid-cols-[280px_1fr] md:p-6 lg:gap-8">
      <Sidebar />
      <div className="flex flex-col">
        <TopBar/>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add Income</h1>
          <Button onClick={scrollToAddIncome}>Add New Income</Button>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recorded Incomes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                income.length > 0 ? (
                  income.map((income) => {
                    return (
                      <TableRow key={income.id}>
                        <TableCell>{income.source}</TableCell>
                        <TableCell>${income.amount}</TableCell>
                        <TableCell>{income.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon"
                            onClick={() => handleUpdate(income.id)}
                          >
                            <MdUpdate className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(income.id)}>
                            <MdDeleteOutline className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>No income recorded</TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </div>
        <Card ref={addIncomeRef}>
          <CardHeader>
            <CardTitle>New Income</CardTitle>
            <CardDescription>Add a new income source</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input id="source" type="text" name="source" value={newIncome?.source} onChange={handleChange} placeholder="Enter income source" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" name="amount" value={newIncome?.amount} onChange={handleChange} placeholder="Enter income amount" />
              </div>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={newIncome.date}
                    onChange={(e) =>
                      setNewIncome({ ...newIncome, date: e.target.value })}                    required
                  />
                </div>
              </div>
              <div className="col-span-2 flex justify-end">
                <Button type="submit">Save Income</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
