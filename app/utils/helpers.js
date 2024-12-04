export const getDayRatingColor = (rating) => {
  const colors = {
    great: 'bg-green-100 text-green-600',
    good: 'bg-blue-100 text-blue-600',
    okay: 'bg-yellow-100 text-yellow-600',
    notGreat: 'bg-orange-100 text-orange-600',
    terrible: 'bg-red-100 text-red-600'
  };
  return colors[rating] || 'bg-gray-100 text-gray-600';
}; 