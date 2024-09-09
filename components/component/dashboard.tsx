"use client"
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { JSX, SVGProps, useCallback, useEffect, useState } from "react"
import { Budget, Income, Transaction } from "@/interfaces/interfaces"
import toast from "react-hot-toast"
import { getToken } from "@/services/auth"
import { Sidebar } from "./sidebar"
import TopBar from "./topBar"

export function calculateTotalIncome(incomes: Income[]): number {
  return incomes?.reduce((accumulator: number, income: Income) => {
    const amount = typeof income.amount === 'string' ? parseFloat(income.amount) : income.amount;
    return accumulator + amount;
  }, 0);
}

export 
function calculateTotalTransactions(transactions: Transaction[]): number {
  return transactions?.reduce((accumulator: number, transaction: Transaction) => {
    const amount = typeof transaction.amount === "string" ? parseFloat(transaction.amount) : transaction.amount;
    return amount + accumulator;
  }, 0);
}

export   function calculateTotalBudget(budgets: Budget[]): number {
  return budgets?.reduce((accumulator: number, budget: Budget) => {
    const amount = typeof budget.amount === 'string' ? parseFloat(budget.amount) : budget.amount;
    return accumulator + amount;
  }, 0);
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const token = getToken();
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [_incomes, setIncomes] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        setTransactions(data);
        setTotalTransactions(calculateTotalTransactions(data));
      } else {
        toast.error(await res.text());
      }
    } catch (error) {
      console.log(error);
    }
  }, [token]);

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
          setTotalBudget(calculateTotalBudget(data));
        } else {
          toast.error(await res.text());
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchBudgets();
    fetchTransactions();
    fetchIncome();
  }, [token, fetchTransactions, fetchIncome]);
  
return (
  <div className="grid min-h-screen w-full grid-cols-1 gap-6 bg-background p-4 md:grid-cols-[280px_1fr] md:p-6 lg:gap-8">
    <Sidebar/>
    <div className="flex flex-col">
      <TopBar/>
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
      {
          totalTransactions > totalIncome && (
            <div className="alert alert-warning mb-6">
              <h2 className="text-lg text-red-600 font-bold">Transaction Warning</h2>
              <ul>
                <li className="text-red-400">The transactions has exceeded by ${totalTransactions - totalIncome}.</li>
              </ul>
            </div>
          )
        }
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
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Current Budget</CardDescription>
              <CardTitle>{totalBudget}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <WalletIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Remaining: $1,200</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total Income</CardDescription>
              <CardTitle>{totalIncome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">This month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle>{totalTransactions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MinusIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">This month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6">
        <Card>
        <CardHeader>
            <CardTitle>Category Budget</CardTitle>
              </CardHeader>
            <CardContent>
            <Table>
            <TableHeader>
                <TableRow className="flex justify-between mr-[169px]">
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody >
                {
                  budgets.map((budget: Budget) => (
                    <TableRow key={budget.id}>
                      <TableCell className="flex justify-between mr-[169px]">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{budget.category}</span>
                        </div>
                        <span className="text-muted-foreground">${budget.amount}</span>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
              </Table>
              </CardContent>
        </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    transactions.map((transaction: Transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-red-600"><span>- $</span>{transaction.amount}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  </div>
)
}



function DollarSignIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

export function LandmarkIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  )
}


function MinusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
    </svg>
  )
}

export function WalletIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}
