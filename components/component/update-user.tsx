"use client"
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/interfaces/interfaces";
import { getToken, getUserFromToken } from "@/services/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar";
import TopBar from "./topBar";

export function UpdateUser() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: "",
    email: "",
    password_hash: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserProfile((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const token = getToken();
  const payload = getUserFromToken()
  const id = payload?.id;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update user profile goes here.
    console.log("User profile updated:", userProfile);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        toast.success("user updated");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (error: any) {
      console.log(error)
      toast.error("An error occurred while updating the user");
    }
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 gap-6 bg-background p-4 md:grid-cols-[280px_1fr] md:p-6 lg:gap-8">
      <Sidebar />
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="flex flex-col">
          <TopBar />
          <Card className="w-full max-w-6xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Update User Profile</CardTitle>
                <CardDescription>Manage your personal account details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={userProfile.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={userProfile.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password_hash"
                    type="password"
                    placeholder="Enter your password"
                    value={userProfile.password_hash}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" className="mr-2" onClick={() => setUserProfile({ username: "", email: "", password_hash: "" })}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
