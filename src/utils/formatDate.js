export const formatDate = (date, format = 'default') => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  if (format === 'date-only') {
    // Format: DD/MM/YYYY
    return dateObj.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }
  
  // Default format with time
  return dateObj.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const getRelativeTime = (date) => {
  const now = new Date()
  const diffInMs = now - new Date(date)
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`
  } else {
    return `${diffInDays} days ago`
  }
}
