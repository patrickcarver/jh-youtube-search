const MAX_RETRIES = 3;
const BASE_DELAY_MILLISECONDS = 1000;
const DEFAULT_OPTIONS = {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
};

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function exponentialBackoffMilliseconds(attempt) {
  return BASE_DELAY_MILLISECONDS * 2 ** (attempt - 1);
}

async function retryWithBackoff(url, options, attempt, errorMessage) {
  if (attempt < MAX_RETRIES) {
    const backoffMilliseconds = exponentialBackoffMilliseconds(attempt);
    await sleep(backoffMilliseconds);
    return fetchWithRetry(url, options, attempt + 1);
  }

  throw new Error(errorMessage);
}

function is4xx(status) {
  return status >= 400 && status <= 499;
}

function is5xx(status) {
  return status >= 500 && status <= 599;
}

async function fetchWithRetry(url, options = {}, attempt = 1) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      if (is5xx(response.status)) {
        const errorMessage = `Max retries exceeded for status code ${response.status}`;
        return retryWithBackoff(url, mergedOptions, attempt, errorMessage);
      }

      if (is4xx(response.status)) {
        throw new Error(`Got status code ${response.status}`);
      }
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      const errorMessage = `Network error after ${MAX_RETRIES} attempts: ${error.message}`;
      return retryWithBackoff(url, mergedOptions, attempt, errorMessage);
    }

    throw error;
  }
}

export { fetchWithRetry };
