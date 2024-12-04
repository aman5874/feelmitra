export default async function handler(req, res) {
    try {
        const response = await fetch('http://localhost:8000/hello'); // Adjust URL to your deployed FastAPI backend
        const data = await response.json();
        
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching from Python backend' });
    }
}