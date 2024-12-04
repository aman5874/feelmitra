import { supabase } from "../../pages/api/superbase"; // Import Supabase client

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id in query" });
  }

  try {
    const { data, error } = await supabase
      .from("analysis")
      .select("*")
      .eq("user_id", user_id)
      .order("analysis_date", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({ analysis: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
