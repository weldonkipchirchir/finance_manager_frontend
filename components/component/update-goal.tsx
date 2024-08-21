"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { getToken } from "@/services/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Goal } from "@/interfaces/interfaces"
import { Popover } from "@radix-ui/react-popover"
import { PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarDaysIcon } from "./update-budget"
import { Calendar } from "../ui/calendar"

export function UpdateGoal() {
  const token = getToken();
  const router = useRouter();

  const [goal, setGoal] = useState<Goal>({
    goal_amount: 0,
    goal_description: "",
    saving: 0,
    deadline: "",
  });

  useEffect(() => {
    const fetchGoal = async (id: number) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goal/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 200) {
          setGoal(data);
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
      fetchGoal(parseInt(id));
    }
  }, [token]);

  const handleUpdate = async(e: { preventDefault: () => void })=>{
    e.preventDefault();

    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goal/${goal.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goal),
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        toast.success("Goal updated");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Failed to update goal");
      }
    }catch(error: any){
      console.log(error)
      toast.error("An error occurred while updating the income");
    }
  }
    
  return (
    <div className="grid min-h-screen w-full grid-cols-1 gap-6 bg-background p-4 md:grid-cols-[280px_1fr] md:p-6 lg:gap-8">
          <Sidebar/>
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Details</CardTitle>
              <CardDescription>Update your financial goal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-6" onSubmit={handleUpdate}>
                <div className="grid gap-3">
                  <Label htmlFor="goal-description">Goal Description</Label>
                  <Textarea
                    id="goal-description"
                    value={goal.goal_description}
                    defaultValue="Save $50,000 for a down payment on a new home."
                    className="min-h-32"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="goal-amount">Goal Amount</Label>
                  <Input id="goal-amount" type="number" defaultValue="50000"
                  value={goal.goal_amount}
                    onChange={(e) => setGoal({ ...goal, goal_amount: parseFloat(e.target.value) })}
                   />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="savings-amount">Savings Amount</Label>
                  <Input id="savings-amount" type="number" defaultValue="25000" 
                  value={goal.saving}
                    onChange={(e) => setGoal({ ...goal, saving: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="start-date">Dadeline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="start-date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarDaysIcon className="mr-2 h-4 w-4" />
                          {goal.deadline}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="single"
                          selected={goal.deadline ? new Date(goal.deadline) : undefined}
                          onSelect={(date) => date && setGoal({ ...goal, deadline: date.toISOString().split("T")[0] })}
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
              <Button onClick={handleUpdate}>Save Goal</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
