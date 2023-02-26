
const btn = document.querySelector("#submitbtn");

btn.addEventListener("click",()=>{

  const selectedDate = document.getElementById("date").value;

// fetch JSON data
  fetch('new.json')
    .then(response => response.json())
    .then(data => {

    // filter data based on item_date
      const filteredData = data.arr.filter(item => item.item_date === selectedDate);
    
      const scheduleTimes = filteredData.map(item => item.schedule_time);
    // console.log(scheduleTimes)
      const counts = scheduleTimes.reduce((acc, curr) => {
            const date = curr.split(' ')[0];
            if (acc[date]) {
              acc[date]++;
            } else {
              acc[date] = 1;
            }
            return acc;
          }, {});
  
       // console.log(counts);

        let x_axis = [];
      for(const date in counts){
          x_axis.push(date);
      }
    

      let y_axis = [];
      for (const date in counts) {
          y_axis.push(counts[date]);
        }
       
    // create chart canvas
   // const scheduleTime = filteredData.length;

    // get count of slot D and L
   // const slotDCount = data.arr.filter(item => item.item_date === selectedDate && item.slot === 'D').length;
    //const slotLCount = data.arr.filter(item => item.item_date === selectedDate && item.slot === 'L').length;

    // create chart
    
        var barColors = ["red"];
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx,{
          type: 'bar',
          data: {
              labels: x_axis,
              datasets: [{
                  label: 'Schedules',
                  data: y_axis,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
              }]
          },
          options: {
            
            scales: {
                y: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            },
           
           
            
        }
        });
       

        function generateNewChart(label){
            
          const intervals = ['12am-3am', '3am-6am', '6am-9am', '9am-12pm', '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am'];

          // Create an object to store the count of dates within each interval
          const counts = {};
          intervals.forEach(interval => counts[interval] = 0);
          const arr = scheduleTimes.filter(dateStr => dateStr.startsWith(label));
          
         // console.log(arr)
      
          // Iterate over the array of dates and increment the count for the corresponding interval
          arr.forEach(dateTime => {
            const hour = parseInt(dateTime.split(' ')[1].split(':')[0]);
            const intervalIndex = Math.floor(hour / 3);
            counts[intervals[intervalIndex]]++;
          });

          // Create arrays for the x-axis labels and y-axis values
          const x_axis = intervals;
          const y_axis = intervals.map(interval => counts[interval]);

                // Destroy the existing chart with ID 'myChart2'
        var existingChart = Chart.getChart("myChart2");
        if (existingChart) {
          existingChart.destroy();
        }



          // Create chart
          var barColors = ["red"];
          var ctx = document.getElementById('myChart2').getContext('2d');
          var chart = new Chart(ctx,{
            type: 'bar',
            data: {
              labels: x_axis,
              datasets: [{
                label: 'Schedules',
                data: y_axis,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }]
            },
            options: {
             maintainAspectRatio:false,
              scales: {
                y: {
                  ticks: {
                    beginAtZero: true
                  }
                }
              }
            }
          })
              
          
          };


          chart.options.onClick = function(event, elements) {
            if (elements && elements.length) {
              const label = chart.data.labels[elements[0].index];
           //   console.log(label);
              
                generateNewChart(label);
              
            }
            
            else{
              console.log("OOPs!!!! Somethis went wrong....")
            }
          }
  });
})
