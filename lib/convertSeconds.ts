const convertSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m ${seconds % 60}s`;
  }

  return `${hours}h ${minutes}m`;
};

export default convertSeconds;
