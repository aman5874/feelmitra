import { execFile } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required for sentiment analysis' });
  }

  // Path to your Python script
  const pythonScriptPath = path.resolve('../../scripts/main.py'); // Update this to your actual script path

  // Execute the Python script
  execFile('python3', [pythonScriptPath, text], (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing Python script:', error);
      return res.status(500).json({ error: 'Failed to analyze sentiment' });
    }

    if (stderr) {
      console.error('Python script error:', stderr);
      return res.status(500).json({ error: 'Python script error' });
    }

    try {
      // Parse the output from the Python script
      const result = JSON.parse(stdout);
      res.status(200).json({ sentiment: result });
    } catch (parseError) {
      console.error('Error parsing Python script output:', parseError);
      res.status(500).json({ error: 'Failed to parse sentiment analysis result' });
    }
  });
}
