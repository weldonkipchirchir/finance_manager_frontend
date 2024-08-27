"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { JSX, SVGProps, useEffect, useRef, useState } from "react";
import { Sidebar } from "./sidebar";
import { Goal } from "@/interfaces/interfaces";
import { getToken } from "@/services/auth";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdUpdate } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import TopBar from "./topBar";

export function Goals() {
  const router = useRouter();
  const [newGoal, setNewGoal] = useState<Goal>({
    goal_amount: 0,
    goal_description: "",
    deadline: "",
    saving: 0
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const token = getToken();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGoals(data);
      })
      .catch((error) => {
        console.error("Error fetching goals:", error);
      });
  }, [token, newGoal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewGoal((prevGoal) => ({
      ...prevGoal,
      [e.target.name]: e.target.value,
    }) as Goal);
  }

  const handleSubmit = async () => {
    if (
      !newGoal.goal_amount ||
      !newGoal.goal_description ||
      !newGoal.deadline
    ) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newGoal),
      });

      if (res.status === 201) {
        toast.success("Goal added");
        setNewGoal({
          goal_amount: 0,
          goal_description: "",
          deadline: "",
          saving: 0
        });
      } else {
        toast.error(await res.text());
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = (id: number | undefined) => {
    router.push(`/goal/update?id=${id}`);
  }

  const handleDelete = async (id: number | undefined) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goal/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        toast.success("goal deleted")
      } else {
        toast.error(await res.text());
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const _isDeadlinePassed = (deadline: string) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < currentDate;
  }

  const addGoalRef = useRef<HTMLDivElement>(null);
  const scrollToAddGoal = () => {
    addGoalRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 gap-6 bg-background p-4 md:grid-cols-[280px_1fr] md:p-6 lg:gap-8">
      <Sidebar />
      <div className="flex flex-col">
      <TopBar/>
      <div className="flex mt-2 items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Goals</h1>
        <Button size="sm" onClick={scrollToAddGoal}>
          Add Goal
        </Button>
      </div>
        <div className="grid gap-8 md:grid-cols-1">
          <div>
            <h1 className="text-xl font-bold mb-4">Your Goals</h1>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Goal</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Saved</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      goals.length > 0 ? (
                        goals.map((goal) => (
                          <TableRow key={goal.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                {/* <span className="font-medium">{goal.goal_description}</span> */}
                                <span className="text-muted-foreground text-sm">{goal.goal_description}</span>
                              </div>
                            </TableCell>
                            <TableCell>{goal.goal_amount}</TableCell>
                            <TableCell>{goal.saving}</TableCell>
                            <TableCell>{goal.deadline}</TableCell>
                            <TableCell>
                              <Progress value={goal.saving / goal.goal_amount * 100} />
                              <div className="text-right text-muted-foreground text-sm">
                                {(goal.saving / goal.goal_amount * 100).toFixed(2)}%
                              </div>
                            </TableCell>
                            <TableCell>
                              <button
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Delete Goal!"
                                className="cursor-pointer mr-2 text-lg"
                                onClick={() => handleDelete(goal.id)}
                              >
                                <MdDeleteOutline />
                                <Tooltip id="my-tooltip" />
                              </button>
                              <button
                                data-tooltip-id="my-update"
                                data-tooltip-content="Update Goal!"
                                className="cursor-pointer text-lg"
                              onClick={() => handleUpdate(goal.id)}
                              >
                                <MdUpdate />
                                <Tooltip id="my-update" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No goals yet.
                          </TableCell>
                        </TableRow>
                      )
                    }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div ref={addGoalRef}>
            <h1 className="text-xl font-bold mb-4">Set a New Goal</h1>
            <Card>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-amount">Goal Amount</Label>
                  <Input id="goal-amount" type="number" name="goal_amount" value={newGoal?.goal_amount} onChange={handleChange} placeholder="$1,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-description">Goal Description</Label>
                  <Textarea id="goal-description" name="goal_description" value={newGoal?.goal_description} onChange={handleChange} placeholder="Save for a down payment on a house" />
                </div>
                <div className="space-y-2">
                  <div>
                  <Label htmlFor="dadeline">Dadeline</Label>
                  <Input
                    type="date"
                    id="dadeline"
                    name="dadeline"
                    value={newGoal.deadline}
                    onChange={(e) =>
                    setNewGoal({ ...newGoal, deadline: e.target.value })}                    required
                  />
                </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmit} className="ml-auto">Save Goal</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarClockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
  )
}
