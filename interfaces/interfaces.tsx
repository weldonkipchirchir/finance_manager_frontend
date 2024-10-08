export interface Budget {
    id?: number;
    category: string;
    amount: number;
    start_date: string;
    end_date: string;
  }

  export interface NewUser{
    username: string;
    password_hash: string;
    email:string;
  }

  export interface Payload{
    id: number;
    email: string;
    exp: number;
  }
  
  export interface Transaction {
    id?: number;
    category: string;
    amount: number;
    description?: string;
    date: string | undefined;
  }

  export interface UserProfile {
    id?: number;
    username: string;
    email: string;
    password_hash?: string;
  }
  export interface Goal{
    id?: number;
    goal_description: string;
    goal_amount: number;
    deadline: string;
  }

  export interface Income {
    id?: number;
    amount: number;
    source: string;
    date: string | undefined;
  } 

  export interface CategoryExceeded {
    name: string;
    amount: number;
  }

export interface Goal{
  id?: number;
  goal_description: string;
  goal_amount: number;
  deadline: string;
  saving: number;
}