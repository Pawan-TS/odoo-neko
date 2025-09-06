const Task = require('../models/Task');

// Generate insights from mood data
exports.generateMoodInsights = async (moodData, projectId) => {
  try {
    const insights = [];
    
    // Check if there's enough data
    if (!moodData.trend || moodData.trend.length < 2) {
      return [{ type: 'info', message: 'Not enough data for meaningful insights yet.' }];
    }
    
    // Check for declining trend
    const recentTrend = moodData.trend.slice(-3);
    if (recentTrend.length >= 2) {
      const latestAvg = parseFloat(recentTrend[recentTrend.length - 1].average);
      const previousAvg = parseFloat(recentTrend[recentTrend.length - 2].average);
      
      if (latestAvg < previousAvg && (previousAvg - latestAvg) > 0.5) {
        insights.push({
          type: 'warning',
          message: 'Team mood has declined significantly in the past week.',
          data: {
            latest: latestAvg,
            previous: previousAvg,
            change: (latestAvg - previousAvg).toFixed(1)
          }
        });
        
        // Check overdue tasks as potential cause
        const overdueTasks = await Task.getOverdueTasks(projectId);
        if (overdueTasks.length > 0) {
          insights.push({
            type: 'info',
            message: `There are ${overdueTasks.length} overdue tasks, which might be affecting team mood.`,
            data: {
              overdueCount: overdueTasks.length
            }
          });
        }
      }
    }
    
    // Check for improving trend
    if (recentTrend.length >= 2) {
      const latestAvg = parseFloat(recentTrend[recentTrend.length - 1].average);
      const previousAvg = parseFloat(recentTrend[recentTrend.length - 2].average);
      
      if (latestAvg > previousAvg && (latestAvg - previousAvg) > 0.5) {
        insights.push({
          type: 'positive',
          message: 'Team mood has improved in the past week.',
          data: {
            latest: latestAvg,
            previous: previousAvg,
            change: (latestAvg - previousAvg).toFixed(1)
          }
        });
      }
    }
    
    // Check for polarized mood distribution
    const distribution = moodData.distribution;
    if (distribution) {
      const high = distribution.filter(d => d.mood_value >= 4).reduce((sum, d) => sum + d.count, 0);
      const low = distribution.filter(d => d.mood_value <= 2).reduce((sum, d) => sum + d.count, 0);
      const total = distribution.reduce((sum, d) => sum + d.count, 0);
      
      if (total > 0 && high > 0 && low > 0) {
        const polarizationRate = (high + low) / total;
        if (polarizationRate > 0.7 && high > total * 0.3 && low > total * 0.3) {
          insights.push({
            type: 'warning',
            message: 'Team mood appears to be polarized with significant high and low ratings.',
            data: {
              highRatings: high,
              lowRatings: low,
              polarizationRate: polarizationRate.toFixed(2)
            }
          });
        }
      }
    }
    
    // If no insights, add a generic one
    if (insights.length === 0) {
      const avgMood = parseFloat(moodData.average);
      if (avgMood >= 4) {
        insights.push({
          type: 'positive',
          message: 'Team mood is positive with a high average rating.'
        });
      } else if (avgMood <= 2) {
        insights.push({
          type: 'warning',
          message: 'Team mood is low. Consider checking in with team members.'
        });
      } else {
        insights.push({
          type: 'info',
          message: 'Team mood is neutral with no significant patterns detected.'
        });
      }
    }
    
    return insights;
  } catch (error) {
    console.error('Error generating mood insights:', error);
    return [{ type: 'error', message: 'Could not generate insights due to an error.' }];
  }
};