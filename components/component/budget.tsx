"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Budget as BudgetType, Income } from "@/interfaces/interfaces";
import { toast } from "react-hot-toast";
import { ArrowUpDown } from "lucide-react";
import { getToken } from "@/services/auth";
import { MdDeleteOutline, MdUpdate } from "react-icons/md";
import { Tooltip } from 'react-tooltip';
import { useRouter } from "next/navigation";
import { calculateTotalBudget, calculateTotalIncome } from "./dashboard";
import { Sidebar } from "./sidebar";
import TopBar from "./topBar";

export function Budget() {
  const router = useRouter();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [newBudget, setNewBudget] = useState<BudgetType>({
    category: "",
    amount: 0,
    start_date: "",
    end_date: "",
  });
  
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof BudgetType>("category");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const addBudgetRef = useRef<HTMLDivElement>(null);
  const token = getToken();

  const fetchIncome = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incomes`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        setIncomes(data);
        setTotalIncome(calculateTotalIncome(data));
      } else {
        toast.error(await res.text());
      }
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const getBudgets = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        setBudgets(data);
        setTotalBudget(calculateTotalBudget(data));
      } else {
        toast.error(await res.text());
      }
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    getBudgets();
    fetchIncome();
  }, [getBudgets, fetchIncome,newBudget]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof BudgetType) => {
    setSortBy((prevSortBy) => (prevSortBy === key ? key : key));
    setSortOrder((prevSortOrder) =>
      sortBy === key
        ? prevSortOrder === "asc"
          ? "desc"
          : "asc"
        : "asc"
    );
  };

  const handleNewBudgetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBudget((prevBudget) => ({
      ...prevBudget,
      [name]: name === "amount" ? parseInt(value, 10) : value,
    }));
  };

  const handleNewBudgetSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setBudgets((prevBudgets) => [
      ...prevBudgets,
      {
        ...newBudget,
      },
    ]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newBudget),
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 201) {
        toast.success("Budget added");
        setNewBudget({
          category: "",
          amount: 0,
          start_date: "",
          end_date: "",
        });
      } else {
        toast.error(await res.text());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: number| undefined
  )=>{
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        toast.success("budget deleted");
      } else {
        toast.error(await res.text());
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = (id: number | undefined) => {
    router.push(`/budget/update?id=${id}`);
  }

  const scrollToAddBudget = () => {
    addBudgetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredBudgets = useMemo(() => {
    return budgets
      .filter((budget) => {
        return (
          budget?.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          budget?.amount.toString().includes(searchTerm) ||
          budget?.start_date.includes(searchTerm) ||
          budget?.end_date.includes(searchTerm)
        );
      })
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortBy]! > b[sortBy]! ? 1 : -1;
        } else {
          return a[sortBy]! < b[sortBy]! ? 1 : -1;
        }
      });
  }, [budgets, searchTerm, sortBy, sortOrder]);

  return (
    <div className="grid min-h-screen w-full grid-cols-1 gap-6 bg-background p-4 md:grid-cols-[280px_1fr] md:p-6 lg:gap-8">
    <Sidebar/>
    <div className="flex flex-col">
      <TopBar/>
            {
          totalBudget> totalIncome && (
            <div className="alert alert-warning mb-6">
              <h2 className="text-lg text-red-600 font-bold">Budget Warning</h2>
              <ul>
                <li className="text-red-400">The budget has exceeded by ${totalBudget - totalIncome}.</li>
              </ul>
            </div>
          )
        }
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <Button onClick={scrollToAddBudget}>Add Budget</Button>
      </div>
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Search budgets..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 mr-4"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={(value: string) =>
                  handleSort(value as keyof BudgetType)
                }
              >
                <DropdownMenuRadioItem value="category">Category</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="amount">Amount</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="start_date">Start Date</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="end_date">End Date</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                Category
                {sortBy === "category" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("amount")}>
                Amount
                {sortBy === "amount" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("start_date")}>
                Start Date
                {sortBy === "start_date" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("end_date")}>
                End Date
                {sortBy === "end_date" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("end_date")}>
                Action
                {sortBy === "end_date" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBudgets?.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell>{budget.category}</TableCell>
                <TableCell className="text-right">${budget.amount}</TableCell>
                <TableCell>{budget.start_date}</TableCell>
                <TableCell>{budget.end_date}</TableCell>
                <TableCell>
                  <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Delete Budget!"
                    className="cursor-pointer mr-2 text-lg"
                    onClick={() => handleDelete(budget.id)}
                  >
                    <MdDeleteOutline />
                    <Tooltip id="my-tooltip"/>
                  </button>
                  <button
                    data-tooltip-id="my-update"
                    data-tooltip-content="Update Budget!"
                    className="cursor-pointer text-lg"
                    onClick={() => handleUpdate(budget.id)}
                  >
                    <MdUpdate />
                    <Tooltip id="my-update"/>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div ref={addBudgetRef}>
        <Card className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
          <CardHeader>
            <CardTitle>Add New Budget</CardTitle>
            <CardDescription>Fill out the form to create a new budget.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newBudget.category || ""}
                  onValueChange={(value) => handleNewBudgetChange({ target: { name: "category", value } } as React.ChangeEvent<HTMLSelectElement>)}
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
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={newBudget.amount}
                onChange={handleNewBudgetChange}
                placeholder="Enter amount"
                required
              />
            </div>
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                type="date"
                id="start_date"
                name="start_date"
                value={newBudget.start_date}
                onChange={handleNewBudgetChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                type="date"
                id="end_date"
                name="end_date"
                value={newBudget.end_date}
                onChange={handleNewBudgetChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleNewBudgetSubmit}>Add Budget</Button>
          </CardFooter>
        </Card>
      </div>
     </div> 
    </div>
  );
}
