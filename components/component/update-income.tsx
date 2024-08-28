"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps, useEffect, useState } from "react"
import { Sidebar } from "./sidebar";
import { getToken } from "@/services/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Income } from "@/interfaces/interfaces"
import TopBar from "./topBar"

export function UpdateIncome() {
  const token = getToken();
  const router = useRouter();

  const [income, setIncome] = useState<Income>({
    source: "",
    amount: 0,
    date: "",
  });

  useEffect(() => {
    const fetchIncome = async (id: number) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/income/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 200) {
          setIncome(data);
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
      fetchIncome(parseInt(id));
    }
  }, [token]);

  const handleUpdate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/income/${income.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(income),
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        toast.success("Income updated");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Failed to update income");
      }
    } catch (error: any) {
      console.log(error)
      toast.error("An error occurred while updating the income");
    }
  }
  return (
    <div className="grid min-h-screen w-full grid-cols-1 gap-6 bg-background p-4 md:grid-cols-[280px_1fr] md:p-6 lg:gap-8">
      <Sidebar />
      <div className="flex-col justify-center">
        <TopBar/>
        <Card className="w-full max-w-6xl h-fit">
          <CardHeader>
            <CardTitle>Update Income</CardTitle>
            <CardDescription>Modify your existing income records.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6" onSubmit={handleUpdate}>
              <div className="grid gap-3">
                <Label htmlFor="source">Source</Label>
                <Input id="source"
                value={income.source}
                  onChange={(e) => setIncome({ ...income, source: e.target.value })} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" defaultValue="50000"
                value={income.amount}
                  onChange={(e) => setIncome({ ...income, amount: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={income.date}
                    onChange={(e) =>
                    setIncome({ ...income, date: e.target.value })}                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Income</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function CalendarDaysIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}
