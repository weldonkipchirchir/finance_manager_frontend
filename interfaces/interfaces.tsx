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
  