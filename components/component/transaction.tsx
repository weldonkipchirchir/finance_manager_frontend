"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getToken } from "@/services/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdDeleteOutline, MdUpdate } from "react-icons/md";
import { Tooltip } from 'react-tooltip';
import type { Budget, CategoryExceeded, Income, Transaction } from "@/interfaces/interfaces";
import { calculateTotalIncome, calculateTotalTransactions } from "./dashboard";
import { Sidebar } from "./sidebar";

export function Transaction() {
  const token = getToken();
  const router = useRouter();
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    category: "",
    amount: 0,
    description: "",
    date: "",
  });
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [exceededCategories, setExceededCategories] = useState<CategoryExceeded[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [_incomes, setIncomes] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  const getTransactions = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        setTransactions(data);
        setTotalTransactions(calculateTotalTransactions(data));
      } else {
        toast.error(await res.text());
      }
    } catch (error) {
      console.log(error);
    }
  },
    [token]);

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


  useEffect(() => {
    async function fetchBudgets() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.status === 200) {
          setBudgets(data);
        } else {
          toast.error(await res.text());
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchBudgets();
    getTransactions();
    fetchIncome();
  }, [getTransactions, fetchIncome, newTransaction, token]);

  useEffect(() => {
    const categoriesExceeded = checkExceedingCategories(transactions, budgets);
    setExceededCategories(categoriesExceeded);
  }, [transactions, budgets]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTransaction({
      ...newTransaction,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    });
  };

  const addTransactionRef = useRef<HTMLDivElement>(null);
  const scrollToAddTransaction = () => {
    addTransactionRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const handleAddTransaction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      !newTransaction.category ||
      newTransaction.amount === 0 ||
      !newTransaction.description ||
      !newTransaction.date
    ) {
      return;
    }

    const newTransactionData: Transaction = {
      category: newTransaction.category,
      amount: Number(newTransaction.amount),
      description: newTransaction.description,
      date: newTransaction.date,
    };

    setTransactions([...transactions, newTransactionData]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newTransaction),
      });

      if (res.status === 201) {
        toast.success("Budget added");
        setNewTransaction({
          category: "",
          amount: 0,
          description: "",
          date: "",
        });
      } else {
        toast.error(await res.text());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        toast.success("transaction deleted")
      } else {
        toast.error(await res.text());
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleUpdate = (id: number | undefined) => {
    router.push(`/transaction/update?id=${id}`);
  }

  const checkExceedingCategories = (transactions: Transaction[], budgets: Budget[]) => {
    const transactionAmounts: { [key: string]: number } = {};
    const budgetAmounts: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      if (transactionAmounts[category]) {
        transactionAmounts[category] += amount;
      } else {
        transactionAmounts[category] = amount;
      }
    });

    budgets.forEach((budget) => {
      const { category, amount } = budget;
      if (budgetAmounts[category]) {
        budgetAmounts[category] += amount;
      } else {
        budgetAmounts[category] = amount;
      }
    });

    const exceededCategories: CategoryExceeded[] = [];

    Object.keys(transactionAmounts).forEach((category) => {
      const totalTransactionAmount = transactionAmounts[category];
      const totalBudgetAmount = budgetAmounts[category] || 0;
      if (totalTransactionAmount > totalBudgetAmount) {
        exceededCategories.push({
          name: category,
          amount: totalTransactionAmount - totalBudgetAmount,
        });
      }
    });

    return exceededCategories;
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 gap-6 bg-background p-4 md:grid-cols-[280px_1fr] md:p-6 lg:gap-8">
    <Sidebar/>
    <div className="flex flex-col">      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button size="sm" onClick={scrollToAddTransaction}>
          Add Transaction
        </Button>
      </div>
      <div className="grid gap-4">
        {exceededCategories.length > 0 && (
          <div className="alert alert-warning mb-6">
            <h2 className="text-lg text-red-600 font-bold">Budget Warning</h2>
            <ul>
              {exceededCategories.map((category: CategoryExceeded, index: number) => (
                <li className="text-red-400" key={index}>
                  The budget for {category.name} has been exceeded by ${category.amount.toFixed(2)}.
                </li>
              ))}

            </ul>
          </div>
        )}{
          totalTransactions > totalIncome && (
            <div className="alert alert-warning mb-6">
              <h2 className="text-lg text-red-600 font-bold">Transaction Warning</h2>
              <ul>
                <li className="text-red-400">The transactions has exceeded by ${totalTransactions - totalIncome}.</li>
              </ul>
            </div>
          )
        }
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium text-red-500`}>
                        - ${transaction.amount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Delete Transaction!"
                        className="cursor-pointer mr-2 text-lg"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <MdDeleteOutline />
                        <Tooltip id="my-tooltip" />
                      </button>
                      <button
                        data-tooltip-id="my-update"
                        data-tooltip-content="Update Transaction!"
                        className="cursor-pointer text-lg"
                        onClick={() => handleUpdate(transaction.id)}
                      >
                        <MdUpdate />
                        <Tooltip id="my-update" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div ref={addTransactionRef}>
          <Card>
            <CardHeader>
              <CardTitle>New Transaction</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="category"
                    value={newTransaction.category ?? ""}
                    onValueChange={(value: string) => handleSelectChange(value, "category")}
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
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={newTransaction.amount ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={newTransaction.description ?? ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      <CalendarClockIcon className="mr-2 h-4 w-4" />
                      {newTransaction.date ?? "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DayPicker
                      selected={newTransaction.date ? new Date(newTransaction.date) : undefined}
                      onDayClick={(day) =>
                        setNewTransaction({ ...newTransaction, date: day.toISOString().slice(0, 10) })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddTransaction}>Add Transaction</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}

function CalendarClockIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
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
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.5 17.5 16 16.3V14" />
      <circle cx="16" cy="16" r="6" />
    </svg>
  );
}
