"use client";
import { createClient } from "@/lib/supabase/supabaseClient";
import React, { useEffect } from "react";
import { useUesrStore } from "./useUserStore";

const StoreProvider = () => {
  const supabase = createClient();
  const { setProfile } = useUesrStore();

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) {
        setProfile(data);
      }
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return null;
};

export default StoreProvider;
