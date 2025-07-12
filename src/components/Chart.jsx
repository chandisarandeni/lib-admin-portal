import React from "react";
import { Chart } from "react-google-charts";

// Library Statistics Chart Component
const LibraryChart = ({ 
  chartType = "ColumnChart", 
  data, 
  title = "Library Statistics",
  subtitle = "Current Overview",
  colors = ['#8E552C', '#B67242', '#D4A574', '#E6C9A3'],
  width = "100%",
  height = "300px"
}) => {
  const options = {
    title: title,
    subtitle: subtitle,
    colors: colors,
    backgroundColor: 'transparent',
    chartArea: { width: '80%', height: '70%' },
    legend: { position: 'bottom' },
    titleTextStyle: {
      color: '#374151',
      fontSize: 16,
      bold: true
    },
    hAxis: {
      textStyle: { color: '#374151' }
    },
    vAxis: {
      textStyle: { color: '#374151' }
    }
  };

  return (
    <Chart
      chartType={chartType}
      data={data}
      options={options}
      width={width}
      height={height}
    />
  );
};

// Create chart data from library statistics
const createLibraryOverviewData = (books, members, currentlyBorrowedBooks, overdueBooks) => {
  return [
    ["Metric", "Count"],
    ["Total Books", books?.length || 0],
    ["Active Members", members?.length || 0],
    ["Books Issued", currentlyBorrowedBooks?.length || 0],
    ["Overdue Books", overdueBooks?.length || 0],
  ];
};

// Create book categories data (sample data - you can replace with real data)
const createCategoriesData = (books) => {
  if (!books || books.length === 0) {
    return [
      ["Category", "Count"],
      ["No Data", 0]
    ];
  }

  // Count books by category/genre
  const categories = {};
  books.forEach(book => {
    const category = book.genre || book.category || 'Uncategorized';
    categories[category] = (categories[category] || 0) + 1;
  });

  const data = [["Category", "Count"]];
  Object.entries(categories).forEach(([category, count]) => {
    data.push([category, count]);
  });

  return data;
};

// Main component that accepts library data as props
const LibraryCharts = ({ 
  books = [], 
  members = [], 
  currentlyBorrowedBooks = [], 
  overdueBooks = [] 
}) => {
  return (
    <div className="space-y-6">
      {/* Library Overview Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <LibraryChart
          chartType="ColumnChart"
          data={createLibraryOverviewData(books, members, currentlyBorrowedBooks, overdueBooks)}
          title="Library Overview"
          subtitle="Current Statistics"
        />
      </div>

      {/* Book Categories Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <LibraryChart
          chartType="PieChart"
          data={createCategoriesData(books)}
          title="Books by Category"
          subtitle="Distribution of Book Genres"
          height="250px"
        />
      </div>
    </div>
  );
};

export default LibraryCharts;