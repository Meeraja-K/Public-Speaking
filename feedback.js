document.addEventListener("DOMContentLoaded", () => { // Wait for the DOM to fully load before executing the script
  // Initialize an object to store feedback ratings
  const feedbackData = { 
    confidence: 0,
    fluency: 0,
    subject: 0,
  };

  const feedbackButtons = document.querySelectorAll(".rating-btn"); // Select all rating buttons

  // Initialize Chart.js with a pie chart
  const ctx = document.getElementById("feedback-chart").getContext("2d"); // Get the 2D context of the canvas for the chart
  const feedbackChart = new Chart(ctx, { // Create a new Chart.js instance
    type: "pie", // Change chart type to 'pie'
    data: {
      labels: ["Confidence", "Fluency", "Subject"], // Labels for the chart slices
      datasets: [
        {
          label: "Rating", // Label for the dataset
          data: [feedbackData.confidence, feedbackData.fluency, feedbackData.subject], // Initial data for the chart
          backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"], // Colors for pie slices
        },
      ],
    },
    options: {
      responsive: true,  // Make the chart responsive to window resizing
      plugins: {
        legend: {
          display: true, // Show legend for pie chart
          position: "top", // Position the legend at the top
        },
        tooltip: {
          enabled: true, // Enable tooltips for pie slices
        },
      },
    },
  });

  // Update ratings and chart when a button is clicked
  feedbackButtons.forEach((button) => { // Loop through each feedback button
    button.addEventListener("click", (e) => { // Add a click event listener to each button
      const category = e.target.dataset.category; // Get the category from the button's data attribute
      const score = parseInt(e.target.dataset.score); // Get the score from the button's data attribute and convert it to an integer

      feedbackData[category] = score; // Update the feedback data for the clicked category

      // Update Chart.js data
      feedbackChart.data.datasets[0].data = [ // Update the chart data with the new scores
        feedbackData.confidence,
        feedbackData.fluency,
        feedbackData.subject,
      ];
      feedbackChart.update(); // Refresh the chart to reflect the new data
    });
  });
});
