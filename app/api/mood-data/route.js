import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange');

  // Example mock data - replace with your actual data fetching logic
  const mockData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Mood Score',
      data: [7, 6, 8, 7, 8],
      borderColor: 'rgb(99, 102, 241)',
      tension: 0.1
    }],
    stats: {
      dailyAverage: 7.2,
      totalEntries: 5
    }
  };

  return NextResponse.json(mockData);
}

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    // Mock sentiment analysis - replace with your actual sentiment analysis logic
    const mockSentiment = {
      score: Math.random() * 10, // Random score between 0-10
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(mockSentiment);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}
