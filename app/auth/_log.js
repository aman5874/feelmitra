export default function handler(req, res) {
    if (req.method === "POST") {
      const { userId, event } = req.body;
  
      if (!userId || !event) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Example: Log to console or save to database
      console.log(`User ${userId} performed ${event} event`);
  
      return res.status(200).json({ message: "Event logged successfully" });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }
  