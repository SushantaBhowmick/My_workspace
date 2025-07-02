"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabaseClient";
import { schema } from "@/types/authForm";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import showToast from "./showToast";
import { useUesrStore } from "@/store/useUserStore";

type AuthType = "login" | "signup";

type FormData = z.infer<typeof schema>;

export default function AuthForm({ type }: { type: AuthType }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {setProfile} = useUesrStore();

  const onSubmit = async (data: FormData) => {
    setLoading(true)    
    const { email, password } = data;
    const { data:{user},error } =
      type === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options:{
                emailRedirectTo:`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
            }
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
    setLoading(false)    
      showToast.error(error.message || "Authentication failed. Please try again.");
    } else {
      if(!user) return;
    setLoading(false)    
      if (type === "signup") {
        showToast.success("Signup successful!","Verify your email");
      } else {
        
        const {data}= await supabase.from('profiles').select("*").eq("id",user?.id).single();
        setProfile(data)
        showToast.success("Login successful!");
        router.push("/dashboard");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto"
    >
      <div>
        <Input placeholder="Email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      <Button className="w-full cursor-pointer" disabled={loading} type="submit">
        {loading ? "Loading..." : type === "signup" ? "Sign Up" : "Login"}
      </Button>
      <div className="flex justify-end">
        {type === "signup" ? (
          <Link href={"/login"} className="text-blue-500 flex">
            Already a User? <ArrowRight />{" "}
          </Link>
        ) : (
          <Link href={"/signup"} className="text-blue-500 flex">
            New User? <ArrowRight />{" "}
          </Link>
        )}
      </div>
    </form>
  );
}
