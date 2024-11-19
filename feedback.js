document.addEventListener("DOMContentLoaded", () => {
  const feedbackData = {
    confidence: 0,
    fluency: 0,
    subject: 0,
  };

  const feedbackButtons = document.querySelectorAll(".rating-btn");

  // Initialize Chart.js with a pie chart
  const ctx = document.getElementById("feedback-chart").getContext("2d");
  const feedbackChart = new Chart(ctx, {
    type: "pie", // Change chart type to 'pie'
    data: {
      labels: ["Confidence", "Fluency", "Subject"],
      datasets: [
        {
          label: "Rating",
          data: [feedbackData.confidence, feedbackData.fluency, feedbackData.subject],
          backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"], // Colors for pie slices
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true, // Show legend for pie chart
          position: "top",
        },
        tooltip: {
          enabled: true, // Enable tooltips for pie slices
        },
      },
    },
  });

  // Update ratings and chart when a button is clicked
  feedbackButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const category = e.target.dataset.category;
      const score = parseInt(e.target.dataset.score);

      feedbackData[category] = score;

      // Update Chart.js data
      feedbackChart.data.datasets[0].data = [
        feedbackData.confidence,
        feedbackData.fluency,
        feedbackData.subject,
      ];
      feedbackChart.update();
    });
  });
});
