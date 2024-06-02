function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) return formatDate(date);
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return formatDate(date);
  interval = Math.floor(seconds / 86400);
  if (interval >= 8) return formatDate(date);
  if (interval > 1) return interval + "d";
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + "h";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + "m";
  return "just now";
}
